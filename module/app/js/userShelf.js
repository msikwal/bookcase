define(function(require){
	var Handlebars = require('handlebars');
	var $ = require('jquery');
	var tmpl_src = require("text!../html/bookshelf.html");
	var generview_tmp = require("text!../html/generview.html");
	
	var userShelf = function(obj) {
		this.bookCaseObj = obj;
	};
	userShelf.prototype = {
			init : function (){
				this.render();
			},
			render : function (){
				var storedArr = this.getStorage();
				this.bookShelfArr =   storedArr ||  this.bookCaseObj.bookcase;
				this.renderBookShelf();
				this.renderGenerBook();
				this.registeEvents();
			},
			setStorage : function(){
				localStorage.setItem("bookShelfArr",JSON.stringify(this.bookShelfArr));
			},
			getStorage : function(){
				if(localStorage.getItem("bookShelfArr")!= "undefined"){
					return JSON.parse(localStorage.getItem("bookShelfArr"));
				}else{
					return [];
				}
			},
			renderBookShelf : function (){
				$(".shelf-container").html(Handlebars.compile(tmpl_src)(this.bookShelfArr));
			},
			renderGenerBook : function (){
				this.generObj = this.getGenerObj();
				$(".gener-container").html(Handlebars.compile(generview_tmp)(this.generObj));
			},
			getGenerObj : function (){
				var self = this;
				var generMap = {};
                var tempArr = new Array();
                var tempArr2 = new Array();
                for(var shelfInd in self.bookShelfArr){
                        var bookArr = self.bookShelfArr[shelfInd].books;
                        var shelfId = self.bookShelfArr[shelfInd].id;
                        for(var bookInd in bookArr){
                              bookArr[bookInd].sId = shelfId;
                              tempArr.push(bookArr[bookInd]);
                        }
                }
                for(var i=0;i<tempArr.length;i++){
                        var bookGener = tempArr[i].genre;
                        generMap[bookGener] = generMap[bookGener] || [];
                        generMap[bookGener].push(tempArr[i]);
                }
                for(var g_name in generMap){
                	var obj = {
                			"gener" : g_name,
                			"books" : generMap[g_name]
                 	}
                	tempArr2.push(obj)
                } 
                return  tempArr2;
			},
			addBookHandler : function (e,self){
				var testObj = {
						"title": "Secrets of the JavaScript Msikwal",
                        "isbn": "193398869eeX",
                        "author": "John Resig",
                        "genre": "Technology"	
				};
				self.addBook("s1",testObj);
				self.setStorage();
				self.render();
			},
			addBook : function(shelfId,testObj){
				var self = this;
				for(var bookIndex in self.bookShelfArr){
					if(self.bookShelfArr[bookIndex].id===shelfId){
						self.bookShelfArr[bookIndex].books.push(testObj);
						return;
					}
				}
			},
			registeEvents: function (){
				var self = this;
				$(".bookcase-container .book_row .book_row_del").on("click", function(e) {
					return self.deleteRowHandler.call(this,e,self);
				});
				$(".g_bookcase-container .g_book_row .g_book_row_del").on("click", function(e) {
					return self.deleteRowHandler.call(this,e,self);
				});
				
				$(".bookcase-container .add_book").on("click", function(e) {
					return self.addBookHandler.call(this,e,self);
				});
				$(".bookcase-container .book_row").on("dragstart", function(e) {
					return self.dragHandler.call(this,e,self);
				});
				$(".bookcase-container .book_row").on("drop", function(e) {
					return self.dropHandler.call(this,e,self);
				});
				$(".bookcase-container .book_row").on("dragover", function(e) {
					return self.allowDropHandler.call(this,e,self);
				});
			},
			deleteRowHandler:function (e,self){
				var shelfisbn = $(this).parent().attr('data-isbn');
				self.deleteBook(shelfisbn);
				self.setStorage();
				self.render();
			},
			deleteBook : function (shelfisbn){
				var self = this;
				var shelfIsbnArr = shelfisbn.split("_");
				var bookShelfArr = self.bookShelfArr;
				for(var bookIndex in self.bookShelfArr){
					if(bookShelfArr[bookIndex].id===shelfIsbnArr[0]){
						var bookArr = bookShelfArr[bookIndex].books;
						for(var index in bookArr){
							if(bookArr[index].isbn==shelfIsbnArr[1]){
								return bookArr.splice(index, 1);
							}
						}
					}
				}
			},
			allowDropHandler : function(ev,self)
			{
				ev.preventDefault();
			},
			dragHandler : function(ev,self)
			{
				var isbn = $(ev.currentTarget).data('isbn');
				ev.originalEvent.dataTransfer.setData("uid",isbn);
			},
			dropHandler : function(ev,self)
			{
				ev.preventDefault();
				var oldbookid = ev.originalEvent.dataTransfer.getData("uid");
				var objectToAdd = self.deleteBook(oldbookid);
				var newbookid = $(ev.currentTarget).data('isbn');
				self.addBook(newbookid.split("_")[0],{
					"title": objectToAdd[0].title,
                    "isbn": objectToAdd[0].isbn,
                    "author": objectToAdd[0].author,
                    "genre": objectToAdd[0].genre	
				});
				self.setStorage();
				self.render();
			}
	};
	return userShelf;
	
	
});