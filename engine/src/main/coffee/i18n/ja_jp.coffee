bundle = {

  identifier: 'ja_jp'

, 'atan is undefined when both inputs are zero.': () ->
    "atan は両方の入力値が 0 であるときは定義することができません。"

, '_ isn_t a valid base for a logarithm.': (b) ->
    "#{b} は有効な対数の底ではありません。"

, 'The square root of _ is an imaginary number.': (n) ->
    "#{n} の平方根は虚数になります。"

, 'Division by zero.': () ->
    "0で除算しています。"

, 'Can_t take logarithm of _.': (n) ->
    "#{n} の対数を取ることはできません。"

, 'random-normal_s second input can_t be negative.': () ->
    "random-normal の第2入力値は負数とすることはできません。"

, '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
    "#{n} はNetLogoで正確に値を表すことができる整数の範囲外になります。"

, 'List is empty.': () ->
    "リストは空です。"

, 'Can_t find element _ of the _ _, which is only of length _.': (n, type, list, length) ->
    "リスト #{type} の長さは #{list} しかないため、第 #{n} 要素はありません。"

, 'The list argument to reduce must not be empty.': () ->
    "空のリストを reduce の入力値とすることはできません。"

, '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
    "#{endIndex} は入力値のリスト#{listLength} の長さよりも大きくなっています。"

, '_ is less than zero.': (index) ->
    "#{index} の値は0未満です。"

, '_ got an empty _ as input.': (prim, type) ->
    "#{prim} の入力値が空のリストでした。"

, '_ isn_t greater than or equal to zero.': (index) ->
    "#{index} の値は0未満です。"

, 'Can_t find the _ of a list with no numbers: __': (aspect, list, punc) ->
    "リスト #{aspect} は数値を含んでいないため平均値を定義することができません。"

, 'Requested _ random items from a list of length _.': (count, length) ->
    "リストの長さが #{length} であるため #{count} 個の要素を選択することはできません。"

, 'Requested _ random agents from a set of only _ agents.': (count, size) ->
    "エージェント集合が #{size} 個のエージェントしか含まないため #{count} 個のエージェントを選択することはできません。"

, 'Can_t find the _ of a list without at least two numbers: __': (aspect, list, punc) ->
    "リスト #{aspect} は2個以上の数値を含んでいないため分散を定義することができません。"

, 'Invalid list of points: _': (points) ->
    "点のリスト #{points} は無効です。"

, 'First input to _ can_t be negative.': (prim) ->
    "#{prim} の第1入力値は負数とすることはできません。"

, '_ expected a true/false value from _, but got _ instead.': (prim, item, value) ->
    "#{prim} の入力値 #{item} は真もしくは偽を返すものである必要がありますが、#{value} を返しています。"

, 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.': (prim, agentType, list, value) ->
    "#{prim} の入力値となるリストはリンク、リンク集合、もしくはリストのみを要素として含むものである必要があります。リスト #{agentType} はリンクでもリンク集合でもない #{list} を含んでいます。"

, 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.': (prim, agentType, list, value) ->
    "#{prim} の入力値となるリストはリンク、リンク集合、もしくはリストのみを要素として含むものである必要があります。リスト #{agentType} は異なる種類のエージェント集合である #{list} を含んでいます。"

, 'REPORT can only be used inside TO-REPORT.': () ->
    "REPORT は TO-REPORT の内側でのみ使うことができます。"

, 'STOP is not allowed inside TO-REPORT.': () ->
    "STOP は TO-REPORT の内側に置くことはできません。"

, 'Reached end of reporter procedure without REPORT being called.': () ->
    "レポータープロシージャの内部で REPORT が実行されていません。"

, 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.': (x, y) ->
    "点 [ #{x} , #{y} ] はワールドの境界の外側に位置し、またワールドの位相はx軸方向もしくはy軸方向で循環を許可していません。"

, 'Cannot move turtle beyond the world_s edge.': () ->
    "タートルをワールドの外側に移動させることはできません。"

, 'there is no heading of a link whose endpoints are in the same position': () ->
    "リンクの端点が同じ場所にあるため heading を定義することができません。"

, 'No heading is defined from a point (_,_) to that same point.': (x, y) ->
    "点 (#{x},#{y}) から同じ点への向きを定義することはできません。"

, 'An rgb list must contain 3 numbers 0-255': () ->
    "RGBリストは0から255までの値をとる3変数のリストである必要があります。"

, 'An rgb list must contain 3 or 4 numbers 0-255': () ->
    "RGBリストは0から255までの値をとる3もしくは4変数のリストである必要があります。"

, 'RGB values must be 0-255': () ->
    "RGB変数は0から255までの値である必要があります。"

, '_ breed does not own variable _': (breedName, varName) ->
    "品種 #{breedName} は変数 #{varName} を持っていません。"

, 'All the list arguments to _ must be the same length.': (primName) ->
    "#{primName} の入力値となるリストはすべて同じ長さである必要があります。"

, '_ cannot take a negative number.': (primName) ->
    "#{primName} は負数を取ることはできません。"

}

module.exports = bundle
