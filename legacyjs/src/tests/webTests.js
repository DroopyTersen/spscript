var permissionsTests = require("./permissionsTests.js");
var should = require("chai").should();
var utils = require("../../lib/utils");

exports.run = function(dao) {
    describe("var web = dao.web", function() {
        this.timeout(5000);
        describe("web.info()", function() {
            it("Should return a promise that resolves to web info", function(done) {
                dao.web.info().then(function(webInfo) {
                    webInfo.should.have.property("Url");
                    webInfo.should.have.property("Title");
                    done();
                })
                .catch(function(err) {
                    console.log(err)
                });
            });
        });

        describe("web.subsites()", function() {
            it("Should return a promise that resolves to an array of subsite web infos.", function(done) {
                dao.web.subsites().then(function(subsites) {
                    subsites.should.be.an("array");
                    if (subsites.length) {
                        subsites[0].should.have.property("Title");
                        subsites[0].should.have.property("ServerRelativeUrl");
                    }
                    done();
                });
            });
        });

        describe("web.getRequestDigest()", function() {
            it("Should return a promise that resolves to a request digest string", function(done) {
                dao.web.getRequestDigest().then(function(digest) {
                    digest.should.not.be.null;
                    done();
                })
            });
        })

        var folderPath = "/shared documents";
        describe("web.getFolder(serverRelativeUrl)", function() {
            var folder = null;
            before(function(done) {
                dao.web.getFolder(folderPath).then(function(result) {
                    folder = result;
                    done();
                });
            });
            it("Should return a promise that resolves to a folder with files and folders", function() {
                folder.should.be.an("object");
                folder.should.have.property("name");
                folder.should.have.property("serverRelativeUrl");
                folder.should.have.property("files");
                folder.files.should.be.an("array");
                folder.should.have.property("folders");
                folder.folders.should.be.an("array");
            });
        });

        var email = "andrew@andrewpetersen.onmicrosoft.com";
        describe("web.getUser(email)", function() {
            var user = null;
            before(function(done){
                dao.web.getUser(email).then(function(result){
                    user = result;
                    done();
                })
            })

            it("Should return a promise that resolves to a user object", function(){
                user.should.not.be.null;
                user.should.have.property("Id");
                user.should.have.property("LoginName");
                user.should.have.property("Email");
            })
        })
        var folderUrl = "/spscript/Shared Documents";
        var filename = "testfile.txt";
        var fileUrl = folderUrl + "/" + filename;

        describe("web.uploadFile(fileContent, serverRelativeFolderUrl)", function() {
            var fileContent = "file content";
            var fileTitle = "test title";
            var response = null;
            before(function(done){
                dao.web.uploadFile(fileContent, folderUrl, { name: filename, Title: fileTitle})
                    .then(function(data){
                        response = data;
                        done();
                    })
            })
            it("Should return a promise that resolves to an object with file and item", function() {
                response.should.not.be.null;
                response.should.have.property("file");
                response.should.have.property("item");
                response.file.should.have.property("ServerRelativeUrl");
            });
            it("Should return an item that has the parent list expanded", function() {
                response.item.should.have.property("Id");
                response.item.should.have.property("ParentList");
                response.item.ParentList.should.have.property("Title");
            })
            it("Should save the file to the right location", function() {
                response.file.ServerRelativeUrl.toLowerCase().should.equal(fileUrl.toLowerCase());
            });
            it("Should allow setting fields after the upload completes", function(done) {
                dao.lists(response.item.ParentList.Title).getItemById(response.item.Id).then(function(retrievedItem){
                    retrievedItem.should.have.property("Title");
                    retrievedItem.Title.should.equal(fileTitle);
                    done();
                })
            })
        })

        describe("web.getFile(serverRelativeFileUrl)", function() {
            var file = null;
            before(function(done){
                dao.web.getFile(fileUrl).then(function(result) {
                    file = result;
                    done();
                })
            })
            it("Should return a promise that resolves to a file object", function() {
                file.should.not.be.null;
                file.should.property("CheckOutType");
                file.should.property("ETag");
                file.should.property("Exists");
                file.should.property("TimeLastModified");
                file.should.property("Name");
                file.should.property("UIVersionLabel");
            })
        });

        var destinationUrl = "/spscript/Shared%20Documents/testfile2.txt";
        describe("web.copyFile(serverRelativeSourceUrl, serverRelativeDestUrl)", function() {
            var startTestTime = new Date();
            var file = null;
            before(function(done){
                dao.web.copyFile(fileUrl, destinationUrl)
                .then(function(){
                    return dao.web.getFile(destinationUrl);
                })
                .then(function(result) {
                    file = result;
                    done();
                }).catch(function(resp) {
                    ("one").should.equal("two", "Error in CopyFile requst");
                    done();
                })
            })
            it("Should return a promise, and once resolved, the new (copied) file should be retrievable.", function() {
                file.should.not.be.null;
                file.should.property("CheckOutType");
                file.should.property("ETag");
                file.should.property("Exists");
                file.should.property("TimeLastModified");
                file.should.property("Name");
                file.should.property("UIVersionLabel");
                // var modified = new Date(file["TimeLastModified"])
                // modified.should.be.above(startTestTime);
            })
        })

        describe("web.deleteFile(serverRelativeFileUrl)", function() {
            var file = null;
            it("Ensure there is a file to delete.", function(done){
                dao.web.getFile(destinationUrl).then(function(result){
                    result.should.not.be.null;
                    result.should.have.property("Name");
                    done();
                });
            })

            it("Should return a promise, and once resolved, the file should NOT be retrievable", function(done){
                dao.web.deleteFile(destinationUrl).then(function(result){
                    dao.web.getFile(destinationUrl)
                        .then(function(){
                            // the call to get file succeeded so for a a failure
                            ("one").should.equal("two");
                            done();
                        })
                        .catch(function(){
                            done();
                            // call to get file failed as expected because file is gone
                        })
                })
            })
        }); 
        describe("web.permissions.getRoleAssignments()", permissionsTests.create(dao.web));
        
        if (utils.isBrowser()) {
            describe("web.permissions.check()", permissionsTests.create(dao.web, "check"));
        }

        describe("web.permissions.check(email)", permissionsTests.create(dao.web, "check", "andrew@andrewpetersen.onmicrosoft.com"))
    });
};