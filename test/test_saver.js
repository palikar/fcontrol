const chai = require('chai');
const expect = require('chai').expect;
// const saver = require('../saver.js')
const sinon = require("sinon");
var rewire = require("rewire");
var saver = rewire("../saver.js");


describe('Saver', function () {
    it('should do nothing (save_attachment)', function () {
        var empty = []
        var ret = saver.save_attachment(empty,null,null)
        expect(ret).to.be.equal(-1);
    });
    it('should do nothing (save_attachment_personal)', function () {
        var empty = [] 
        var ret = saver.save_attachment_personal(empty,null,null)
        expect(ret).to.be.equal(-1); 
    });

    it('should not find good atachement (save_attachment)', function () {
        var atachments = [{type:'jiberish'},
                          {type:'jiberish'}]
        var event = {body:"nothing special"}
        
        var ret = saver.save_attachment(atachments,event,null)
        expect(ret).to.be.equal(-1); 
    });
    
    it('should not find good atachement (save_attachment_personal)', function () {
        var atachments = [{type:'jiberish'},
                          {type:'jiberish'}]
        var event = {body:"nothing special"}
        
        var ret = saver.save_attachment_personal(atachments,event,null)
        expect(ret).to.be.equal(-1); 
    });

    
    it('should try save photo in :collected: (save_attachment)', function () {
        var atachments = [{type:'photo', link:"random"},
                          {type:'jiberish'}]
        var event = {body:"nothing special"}

        handler = sinon.spy()
        var restore = saver.__set__("atachment_processors['photo']", handler)
        saver.save_attachment(atachments,event,"api")

        chai.assert(handler.called, "The atachment handler was called");
        chai.assert.equal(handler.args[0][0].link, "random");
        chai.assert.equal(handler.args[0][1], saver.__get__("folders[':collected:']"));
        chai.assert.equal(handler.args[0][2], "api");
        chai.assert.equal(handler.args[0][3].body, event.body);

        restore()
    });

    it('should try save photo in :collected: (save_attachment_personal)', function () {
        var atachments = [{type:'photo', link:"random"},
                          {type:'jiberish'}]
        var event = {body:"nothing special"}

        handler = sinon.spy()
        var restore = saver.__set__("atachment_processors['photo']", handler)
        saver.save_attachment_personal(atachments,event,"api")

        chai.assert(handler.called, "The atachment handler was called");
        chai.assert.equal(handler.args[0][0].link, "random");
        chai.assert.equal(handler.args[0][1], saver.__get__("folders[':collected:']"));
        chai.assert.equal(handler.args[0][2], "api");
        chai.assert.equal(handler.args[0][3].body, event.body);

        restore()
    });

    it('should try save photo in :cats: (save_attachment_personal)', function () {
        var atachments = [{type:'photo', link:"random"},
                          {type:'jiberish'}]
        var event = {body:"Save in :cats: special"}

        handler = sinon.spy()
        var restore = saver.__set__("atachment_processors['photo']", handler)

        saver.save_attachment_personal(atachments,event,"api")

        chai.assert(handler.called, "The atachment handler was called");
        chai.assert.equal(handler.args[0][0].link, "random");
        chai.assert.equal(handler.args[0][1], saver.__get__("folders[':cats:']"));
        chai.assert.equal(handler.args[0][2], "api");
        chai.assert.equal(handler.args[0][3].body, event.body);

        restore()
    });


    
    it('should test the the photo handler', function () {

        var atachment = {type:'photo', largePreviewUrl:"random", ID:42};
        var event = {body:"Save in :cats: special", threadID:21, userInfo:{name:"stan"}};
        var folder = "/this/is/not/folder"
        var api = "api"
        
        handler_1 = sinon.spy()
        handler_2 = sinon.spy()
        handler_3 = sinon.spy()
        
        var restore = saver.__set__(
            {
                "logging.log_atachment" : handler_1,
                "utils.makeDirs" : handler_2,
                "utils.download" : handler_3

            })

        saver.__get__("atachment_processors['photo']")(atachment,folder, api, event)

        chai.assert(handler_1.called, "The logging was called");
        chai.assert(handler_2.called, "The makingDir  was called");
        chai.assert(handler_3.called, "The download was called");

        chai.assert.equal(handler_2.args[0][0], folder);
        
        chai.assert.equal(handler_3.args[0][0], atachment.largePreviewUrl);
        
        restore()
    });

    
});
