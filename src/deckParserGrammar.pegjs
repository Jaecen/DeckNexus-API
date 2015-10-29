start
  = b: board+ eof
    { return { boards: b }; }

board
  = t:boardType lineTerminator c:cardLine+
    { return { type: t, cards: c }; }

boardType
  = t:("main" / "side" / "maybe")("board" / "deck")
    { return t; }

cardLine
  = q:number[Xx]? whitespace n:cardName whitespace? (lineTerminator / eof) 
    { return { quantity: q, name: n}; }

number
  = d:[0-9]+ { return parseInt(d.join(""), 10); }

cardName
  = c:[^\n^\r]+ { return c.join(""); }

whitespace
  = ("\t" / " ")+

lineTerminator
  = [\n\r]+

eof
  = !.