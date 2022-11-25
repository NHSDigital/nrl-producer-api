const { describe, test, expect } = require('@jest/globals');
const { rewriteIfMatch } = require('./utils');

describe('RewriteResponse', function() {

    test.each`
    path                                                | input                             | output                | expected
    ----------------------------------------------------|-----------------------------------|-----------------------|---------------------------------
    ${"/nrl-producer-api/R4/DocumentReference"}         | ${"/nrl-producer-api/R4/(.+)"}    | ${"/production/$1"}   | ${"/production/DocumentReference"}
    ${"/nrl-consumer-api/R4/DocumentReference"}         | ${"/nrl-consumer-api/R4/(.+)"}    | ${"/production/$1"}   | ${"/production/DocumentReference"}
    ${"/nrl-consumer-api/R4/DocumentReference/_search"} | ${"/nrl-consumer-api/R4/(.+)"}    | ${"/production/$1"}   | ${"/production/DocumentReference/_search"}
    `('match: $path -> $expected', function({ path, input, output, expected }) {
        const actual = rewriteIfMatch(path, input, output);
        expect(actual).toEqual(expected);
    });

    test.each`
    path                                        | input                             | output    | expected
    --------------------------------------------|-----------------------------------|-----------|--------------------------
    ${"/_status"}                               | ${"/nrl-producer-api/R4(/.+)"}    | ${"$1"}   | ${"/_status"}
    ${"/_ping"}                                 | ${"/nrl-producer-api/R4(/.+)"}    | ${"$1"}   | ${"/_ping"}
    `('no match: $path -> $expected', function({ path, input, output, expected }) {
        const actual = rewriteIfMatch(path, input, output);
        expect(actual).toEqual(expected);
    });


});
