var metaparser = require("./index")
,   expect = require("expect.js");

var buildParsedContent = function (valid, unknown, invalid) {
    var parsed = {validProperties: {}, unknownProperties: {}, invalidValues: {}};
    if (valid) {
        parsed.validProperties = valid;
    }
    if (unknown) {
        parsed.unknownProperties = unknown;
    }
    if (invalid) {
        parsed.invalidValues = invalid;
    }
    return parsed;
}

var contentAttributeTests = [
    {desc: "parse correctly a simple valid viewport declaration",
     inp: "width=device-width, initial-scale=1, maximum-scale=2",
     out: buildParsedContent({"width":"device-width","initial-scale":1, "maximum-scale":2})},
    {desc: "ignore the string after a number in a value",
     inp: "width=400px",
     out: buildParsedContent({"width":400})},
    {desc: "handle a semi-colon as a comma",
     inp: "width=400; initial-scale=1.5",
     out: buildParsedContent({"width":400,"initial-scale":1.5})},
    {desc: "report separately unknown property names",
     inp:"widht=400px; initial-scale=1.5",
     out: buildParsedContent({"initial-scale":1.5}, {"widht": "400px"})},
    {desc: "handle safari shrink-to-fit",
      inp:"initial-scale=1.5; shrink-to-fit=no",
      out: buildParsedContent({"initial-scale":1.5, "shrink-to-fit": "no"})},
    {desc: "handle bad safari shrink-to-fit value",
      inp:"shrink-to-fit=foo",
      out: buildParsedContent({"shrink-to-fit":null},null, {"shrink-to-fit": "foo"})},
    {desc: "handle safari viewport-fit",
      inp:"initial-scale=1; viewport-fit=auto",
      out: buildParsedContent({"initial-scale": 1, "viewport-fit":"auto"})},
    {desc: "handle safari viewport-fit=cover",
      inp:"initial-scale=1; viewport-fit=cover",
      out: buildParsedContent({"initial-scale": 1, "viewport-fit":"cover"})},
    {desc: "handle bad safari viewport-fit value",
      inp:"viewport-fit=foo",
      out: buildParsedContent({"viewport-fit":null}, null, {"viewport-fit": "foo"})},
    {desc: "handle whitespace correctly",
     inp:"        width=400\
 \r, initial-scale=2",
     out:buildParsedContent({"width":400, "initial-scale":2})},
    {desc: "report unknown values",
     inp:"width=foo",
     out: buildParsedContent({"width":null}, null, {"width":"foo"})}
];

var UA1 = { deviceWidth: 320, deviceHeight: 480, minZoom: 0.25, maxZoom: 4};
var UA2 = { deviceWidth: 640, deviceHeight: 960, minZoom: 0.25, maxZoom: 4};

var viewportRenderingTests = [
    {inp: "width=400, initial-scale=1", ua: UA1,  out:{zoom: 1, width: 400, height: 600, userZoom: "zoom"}},
    {inp: "width=400, initial-scale=1", ua: UA2,  out:{zoom: 1, width: 640, height: 960, userZoom: "zoom"}},
    {inp: "width=400", ua: UA1,  out:{zoom: null, width: 400, height: 600, userZoom: "zoom"}},
    {inp: "initial-scale=1", ua: UA1,  out:{zoom: 1, width: 320, height: 480, userZoom: "zoom"}},
    {inp: "initial-scale=2.0,height=device-width", ua: UA1,  out:{zoom: 2, width: 213, height: 320, userZoom: "zoom"}},
    {inp: "width=480, initial-scale=2.0, user-scalable=no", ua: UA1,  out:{zoom: 2, width: 480, height: 720, userZoom: "fixed"}},
];

contentAttributeTests.forEach(function (test) {
    describe("Parsing " + test.inp, function () {
        it('should ' + test.desc + ' "' + test.inp + '"', function () {
            var out = metaparser.parseMetaViewPortContent(test.inp);
            expect(out).to.eql(test.out);
            // strict deep equality for valid properties
            Object.keys(out.validProperties).forEach(function (name) {
                expect(out.validProperties[name]).to.equal(test.out.validProperties[name]);
            });
        });
    });
});

viewportRenderingTests.forEach(function (test) {
    describe("Parsing " + test.inp + " for rendering with " + JSON.stringify(test.ua), function () {
        it('should match the expected output', function () {
            var viewportProps = metaparser.parseMetaViewPortContent(test.inp);
            var renderingData = metaparser.getRenderingDataFromViewport(viewportProps.validProperties, test.ua.deviceWidth, test.ua.deviceHeight, test.ua.maxZoom, test.ua.minZoom);
            expect(renderingData).to.eql(test.out);
        });
    });
});

