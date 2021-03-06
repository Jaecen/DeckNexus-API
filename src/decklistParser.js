module.exports = (function () {
	"use strict";

	/*
	 * Generated by PEG.js 0.9.0.
	 *
	 * http://pegjs.org/
	 */

	function peg$subclass(child, parent) {
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
	}

	function peg$SyntaxError(message, expected, found, location) {
		this.message = message;
		this.expected = expected;
		this.found = found;
		this.location = location;
		this.name = "SyntaxError";

		if (typeof Error.captureStackTrace === "function") {
			Error.captureStackTrace(this, peg$SyntaxError);
		}
	}

	peg$subclass(peg$SyntaxError, Error);

	function peg$parse(input) {
		var options = arguments.length > 1 ? arguments[1] : {},
			parser = this,

			peg$FAILED = {},

			peg$startRuleFunctions = { start: peg$parsestart },
			peg$startRuleFunction = peg$parsestart,

			peg$c0 = function (b) { return { boards: b }; },
			peg$c1 = function (t, c) { return { type: t, cards: c }; },
			peg$c2 = "main",
			peg$c3 = { type: "literal", value: "main", description: "\"main\"" },
			peg$c4 = "side",
			peg$c5 = { type: "literal", value: "side", description: "\"side\"" },
			peg$c6 = "maybe",
			peg$c7 = { type: "literal", value: "maybe", description: "\"maybe\"" },
			peg$c8 = "board",
			peg$c9 = { type: "literal", value: "board", description: "\"board\"" },
			peg$c10 = "deck",
			peg$c11 = { type: "literal", value: "deck", description: "\"deck\"" },
			peg$c12 = function (t) { return t; },
			peg$c13 = /^[Xx]/,
			peg$c14 = { type: "class", value: "[Xx]", description: "[Xx]" },
			peg$c15 = function (q, n) { return { quantity: q, name: n }; },
			peg$c16 = /^[0-9]/,
			peg$c17 = { type: "class", value: "[0-9]", description: "[0-9]" },
			peg$c18 = function (d) { return parseInt(d.join(""), 10); },
			peg$c19 = /^[^\n\^\r]/,
			peg$c20 = { type: "class", value: "[^\\n^\\r]", description: "[^\\n^\\r]" },
			peg$c21 = function (c) { return c.join(""); },
			peg$c22 = "\t",
			peg$c23 = { type: "literal", value: "\t", description: "\"\\t\"" },
			peg$c24 = " ",
			peg$c25 = { type: "literal", value: " ", description: "\" \"" },
			peg$c26 = /^[\n\r]/,
			peg$c27 = { type: "class", value: "[\\n\\r]", description: "[\\n\\r]" },
			peg$c28 = { type: "any", description: "any character" },

			peg$currPos = 0,
			peg$savedPos = 0,
			peg$posDetailsCache = [{ line: 1, column: 1, seenCR: false }],
			peg$maxFailPos = 0,
			peg$maxFailExpected = [],
			peg$silentFails = 0,

			peg$result;

		if ("startRule" in options) {
			if (!(options.startRule in peg$startRuleFunctions)) {
				throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
			}

			peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
		}

		function text() {
			return input.substring(peg$savedPos, peg$currPos);
		}

		function location() {
			return peg$computeLocation(peg$savedPos, peg$currPos);
		}

		function expected(description) {
			throw peg$buildException(
				null,
				[{ type: "other", description: description }],
				input.substring(peg$savedPos, peg$currPos),
				peg$computeLocation(peg$savedPos, peg$currPos)
			);
		}

		function error(message) {
			throw peg$buildException(
				message,
				null,
				input.substring(peg$savedPos, peg$currPos),
				peg$computeLocation(peg$savedPos, peg$currPos)
			);
		}

		function peg$computePosDetails(pos) {
			var details = peg$posDetailsCache[pos],
				p, ch;

			if (details) {
				return details;
			} else {
				p = pos - 1;
				while (!peg$posDetailsCache[p]) {
					p--;
				}

				details = peg$posDetailsCache[p];
				details = {
					line: details.line,
					column: details.column,
					seenCR: details.seenCR
				};

				while (p < pos) {
					ch = input.charAt(p);
					if (ch === "\n") {
						if (!details.seenCR) { details.line++; }
						details.column = 1;
						details.seenCR = false;
					} else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
						details.line++;
						details.column = 1;
						details.seenCR = true;
					} else {
						details.column++;
						details.seenCR = false;
					}

					p++;
				}

				peg$posDetailsCache[pos] = details;
				return details;
			}
		}

		function peg$computeLocation(startPos, endPos) {
			var startPosDetails = peg$computePosDetails(startPos),
				endPosDetails = peg$computePosDetails(endPos);

			return {
				start: {
					offset: startPos,
					line: startPosDetails.line,
					column: startPosDetails.column
				},
				end: {
					offset: endPos,
					line: endPosDetails.line,
					column: endPosDetails.column
				}
			};
		}

		function peg$fail(expected) {
			if (peg$currPos < peg$maxFailPos) { return; }

			if (peg$currPos > peg$maxFailPos) {
				peg$maxFailPos = peg$currPos;
				peg$maxFailExpected = [];
			}

			peg$maxFailExpected.push(expected);
		}

		function peg$buildException(message, expected, found, location) {
			function cleanupExpected(expected) {
				var i = 1;

				expected.sort(function (a, b) {
					if (a.description < b.description) {
						return -1;
					} else if (a.description > b.description) {
						return 1;
					} else {
						return 0;
					}
				});

				while (i < expected.length) {
					if (expected[i - 1] === expected[i]) {
						expected.splice(i, 1);
					} else {
						i++;
					}
				}
			}

			function buildMessage(expected, found) {
				function stringEscape(s) {
					function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

					return s
						.replace(/\\/g, '\\\\')
						.replace(/"/g, '\\"')
						.replace(/\x08/g, '\\b')
						.replace(/\t/g, '\\t')
						.replace(/\n/g, '\\n')
						.replace(/\f/g, '\\f')
						.replace(/\r/g, '\\r')
						.replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
						.replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) { return '\\x' + hex(ch); })
						.replace(/[\u0100-\u0FFF]/g, function (ch) { return '\\u0' + hex(ch); })
						.replace(/[\u1000-\uFFFF]/g, function (ch) { return '\\u' + hex(ch); });
				}

				var expectedDescs = new Array(expected.length),
					expectedDesc, foundDesc, i;

				for (i = 0; i < expected.length; i++) {
					expectedDescs[i] = expected[i].description;
				}

				expectedDesc = expected.length > 1
					? expectedDescs.slice(0, -1).join(", ")
					+ " or "
					+ expectedDescs[expected.length - 1]
					: expectedDescs[0];

				foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

				return "Expected " + expectedDesc + " but " + foundDesc + " found.";
			}

			if (expected !== null) {
				cleanupExpected(expected);
			}

			return new peg$SyntaxError(
				message !== null ? message : buildMessage(expected, found),
				expected,
				found,
				location
			);
		}

		function peg$parsestart() {
			var s0, s1, s2;

			s0 = peg$currPos;
			s1 = [];
			s2 = peg$parseboard();
			if (s2 !== peg$FAILED) {
				while (s2 !== peg$FAILED) {
					s1.push(s2);
					s2 = peg$parseboard();
				}
			} else {
				s1 = peg$FAILED;
			}
			if (s1 !== peg$FAILED) {
				s2 = peg$parseeof();
				if (s2 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c0(s1);
					s0 = s1;
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}

			return s0;
		}

		function peg$parseboard() {
			var s0, s1, s2, s3, s4;

			s0 = peg$currPos;
			s1 = peg$parseboardType();
			if (s1 !== peg$FAILED) {
				s2 = peg$parselineTerminator();
				if (s2 !== peg$FAILED) {
					s3 = [];
					s4 = peg$parsecardLine();
					if (s4 !== peg$FAILED) {
						while (s4 !== peg$FAILED) {
							s3.push(s4);
							s4 = peg$parsecardLine();
						}
					} else {
						s3 = peg$FAILED;
					}
					if (s3 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c1(s1, s3);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}

			return s0;
		}

		function peg$parseboardType() {
			var s0, s1, s2;

			s0 = peg$currPos;
			if (input.substr(peg$currPos, 4) === peg$c2) {
				s1 = peg$c2;
				peg$currPos += 4;
			} else {
				s1 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c3); }
			}
			if (s1 === peg$FAILED) {
				if (input.substr(peg$currPos, 4) === peg$c4) {
					s1 = peg$c4;
					peg$currPos += 4;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) { peg$fail(peg$c5); }
				}
				if (s1 === peg$FAILED) {
					if (input.substr(peg$currPos, 5) === peg$c6) {
						s1 = peg$c6;
						peg$currPos += 5;
					} else {
						s1 = peg$FAILED;
						if (peg$silentFails === 0) { peg$fail(peg$c7); }
					}
				}
			}
			if (s1 !== peg$FAILED) {
				if (input.substr(peg$currPos, 5) === peg$c8) {
					s2 = peg$c8;
					peg$currPos += 5;
				} else {
					s2 = peg$FAILED;
					if (peg$silentFails === 0) { peg$fail(peg$c9); }
				}
				if (s2 === peg$FAILED) {
					if (input.substr(peg$currPos, 4) === peg$c10) {
						s2 = peg$c10;
						peg$currPos += 4;
					} else {
						s2 = peg$FAILED;
						if (peg$silentFails === 0) { peg$fail(peg$c11); }
					}
				}
				if (s2 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c12(s1);
					s0 = s1;
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}

			return s0;
		}

		function peg$parsecardLine() {
			var s0, s1, s2, s3, s4, s5, s6;

			s0 = peg$currPos;
			s1 = peg$parsenumber();
			if (s1 !== peg$FAILED) {
				if (peg$c13.test(input.charAt(peg$currPos))) {
					s2 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s2 = peg$FAILED;
					if (peg$silentFails === 0) { peg$fail(peg$c14); }
				}
				if (s2 === peg$FAILED) {
					s2 = null;
				}
				if (s2 !== peg$FAILED) {
					s3 = peg$parsewhitespace();
					if (s3 !== peg$FAILED) {
						s4 = peg$parsecardName();
						if (s4 !== peg$FAILED) {
							s5 = peg$parsewhitespace();
							if (s5 === peg$FAILED) {
								s5 = null;
							}
							if (s5 !== peg$FAILED) {
								s6 = peg$parselineTerminator();
								if (s6 === peg$FAILED) {
									s6 = peg$parseeof();
								}
								if (s6 !== peg$FAILED) {
									peg$savedPos = s0;
									s1 = peg$c15(s1, s4);
									s0 = s1;
								} else {
									peg$currPos = s0;
									s0 = peg$FAILED;
								}
							} else {
								peg$currPos = s0;
								s0 = peg$FAILED;
							}
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}

			return s0;
		}

		function peg$parsenumber() {
			var s0, s1, s2;

			s0 = peg$currPos;
			s1 = [];
			if (peg$c16.test(input.charAt(peg$currPos))) {
				s2 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s2 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c17); }
			}
			if (s2 !== peg$FAILED) {
				while (s2 !== peg$FAILED) {
					s1.push(s2);
					if (peg$c16.test(input.charAt(peg$currPos))) {
						s2 = input.charAt(peg$currPos);
						peg$currPos++;
					} else {
						s2 = peg$FAILED;
						if (peg$silentFails === 0) { peg$fail(peg$c17); }
					}
				}
			} else {
				s1 = peg$FAILED;
			}
			if (s1 !== peg$FAILED) {
				peg$savedPos = s0;
				s1 = peg$c18(s1);
			}
			s0 = s1;

			return s0;
		}

		function peg$parsecardName() {
			var s0, s1, s2;

			s0 = peg$currPos;
			s1 = [];
			if (peg$c19.test(input.charAt(peg$currPos))) {
				s2 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s2 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c20); }
			}
			if (s2 !== peg$FAILED) {
				while (s2 !== peg$FAILED) {
					s1.push(s2);
					if (peg$c19.test(input.charAt(peg$currPos))) {
						s2 = input.charAt(peg$currPos);
						peg$currPos++;
					} else {
						s2 = peg$FAILED;
						if (peg$silentFails === 0) { peg$fail(peg$c20); }
					}
				}
			} else {
				s1 = peg$FAILED;
			}
			if (s1 !== peg$FAILED) {
				peg$savedPos = s0;
				s1 = peg$c21(s1);
			}
			s0 = s1;

			return s0;
		}

		function peg$parsewhitespace() {
			var s0, s1;

			s0 = [];
			if (input.charCodeAt(peg$currPos) === 9) {
				s1 = peg$c22;
				peg$currPos++;
			} else {
				s1 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c23); }
			}
			if (s1 === peg$FAILED) {
				if (input.charCodeAt(peg$currPos) === 32) {
					s1 = peg$c24;
					peg$currPos++;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) { peg$fail(peg$c25); }
				}
			}
			if (s1 !== peg$FAILED) {
				while (s1 !== peg$FAILED) {
					s0.push(s1);
					if (input.charCodeAt(peg$currPos) === 9) {
						s1 = peg$c22;
						peg$currPos++;
					} else {
						s1 = peg$FAILED;
						if (peg$silentFails === 0) { peg$fail(peg$c23); }
					}
					if (s1 === peg$FAILED) {
						if (input.charCodeAt(peg$currPos) === 32) {
							s1 = peg$c24;
							peg$currPos++;
						} else {
							s1 = peg$FAILED;
							if (peg$silentFails === 0) { peg$fail(peg$c25); }
						}
					}
				}
			} else {
				s0 = peg$FAILED;
			}

			return s0;
		}

		function peg$parselineTerminator() {
			var s0, s1;

			s0 = [];
			if (peg$c26.test(input.charAt(peg$currPos))) {
				s1 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s1 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c27); }
			}
			if (s1 !== peg$FAILED) {
				while (s1 !== peg$FAILED) {
					s0.push(s1);
					if (peg$c26.test(input.charAt(peg$currPos))) {
						s1 = input.charAt(peg$currPos);
						peg$currPos++;
					} else {
						s1 = peg$FAILED;
						if (peg$silentFails === 0) { peg$fail(peg$c27); }
					}
				}
			} else {
				s0 = peg$FAILED;
			}

			return s0;
		}

		function peg$parseeof() {
			var s0, s1;

			s0 = peg$currPos;
			peg$silentFails++;
			if (input.length > peg$currPos) {
				s1 = input.charAt(peg$currPos);
				peg$currPos++;
			} else {
				s1 = peg$FAILED;
				if (peg$silentFails === 0) { peg$fail(peg$c28); }
			}
			peg$silentFails--;
			if (s1 === peg$FAILED) {
				s0 = void 0;
			} else {
				peg$currPos = s0;
				s0 = peg$FAILED;
			}

			return s0;
		}

		peg$result = peg$startRuleFunction();

		if (peg$result !== peg$FAILED && peg$currPos === input.length) {
			return peg$result;
		} else {
			if (peg$result !== peg$FAILED && peg$currPos < input.length) {
				peg$fail({ type: "end", description: "end of input" });
			}

			throw peg$buildException(
				null,
				peg$maxFailExpected,
				peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
				peg$maxFailPos < input.length
					? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
					: peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
			);
		}
	}

	return {
		SyntaxError: peg$SyntaxError,
		parse: peg$parse
	};
})();
