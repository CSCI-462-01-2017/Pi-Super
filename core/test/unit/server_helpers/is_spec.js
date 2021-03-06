var should = require('should'),
    sinon = require('sinon'),
    hbs = require('express-hbs'),
    utils = require('./utils'),
    handlebars = hbs.handlebars,
    helpers = require('../../../server/helpers'),
    logging = require('../../../server/logging'),

    sandbox = sinon.sandbox.create();

describe('{{#is}} helper', function () {
    before(function () {
        utils.loadHelpers();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('has loaded is block helper', function () {
        should.exist(handlebars.helpers.is);
    });

    // All positive tests
    it('should match single context "index"', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.is.call(
            {},
            'index',
            {fn: fn, inverse: inverse, data: {root: {context: ['home', 'index']}}}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should match OR context "index, paged"', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.is.call(
            {},
            'index, paged',
            {fn: fn, inverse: inverse, data: {root: {context: ['tag', 'paged']}}}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should not match "paged"', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.is.call(
            {},
            'paged',
            {fn: fn, inverse: inverse, data: {root: {context: ['index', 'home']}}}
        );

        fn.called.should.be.false();
        inverse.called.should.be.true();
    });

    it('should log warning with no args', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy(),
            logWarn = sandbox.stub(logging, 'warn');

        helpers.is.call(
            {},
            undefined,
            {fn: fn, inverse: inverse, data: {root: {context: ['index', 'home']}}}
        );

        logWarn.called.should.be.true();
        fn.called.should.be.false();
        inverse.called.should.be.false();
    });
});
