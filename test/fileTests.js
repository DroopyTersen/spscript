exports.run = function(dao) {
	var folderPath = "/Lists/TestLibrary";
	describe("SPScript.RestDao.getFolder(serverRelativeUrl)", function () {
        var folder = null;
        before(function (done) {
            dao.getFolder(folderPath).then(function (result) {
				folder = result;
                console.log(folder);
                done();
            });
        });
        it("Should return a promise that resolves to a folder with files and folders", function () {
            folder.should.be.an("object");
            folder.should.have.property("name");
            folder.should.have.property("serverRelativeUrl");
            folder.should.have.property("files");
            folder.files.should.be.an("array");
            folder.should.have.property("folders");
            folder.folders.should.be.an("array");
        });
    });
};