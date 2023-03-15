# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

bundle = {

  identifier: 'zh_cn'

  # Math Prims

  , 'atan is undefined when both inputs are zero.': () ->
      "当两个输入值都为 0 时，atan 函数没有定义。"

  , '_ isn_t a valid base for a logarithm.': (b) ->
      "#{b} 不是一个有效的对数底数。"

  , 'The square root of _ is an imaginary number.': (n) ->
      "值 #{n} 的平方根是虚数，无法运算。"

  , 'math operation produced a non-number': () ->
      "数学运算产生了一个非数字。"

  , 'math operation produced a number too large for NetLogo': () ->
      "数学运算产生了一个对 NetLogo 来说过大的数字。"

  , 'Division by zero.': () ->
      "被零除（的结果不存在）。"

  , 'Can_t take logarithm of _.': (n) ->
      "无法为值 #{n} 取对数。"

  # Color Prims

  , 'Color must be a number or a valid RGB/A color list with 3 - 4 numbers that have values between 0 and 255.': () ->
      '颜色必须是一个 RGB 颜色列表，其中包含 3-4 个 0-255 之间的数字。'

  # Other Prims

  , 'random-normal_s second input can_t be negative.': () ->
      "random-normal 的第二个输入不能为负。"

  , 'Both Inputs to RANDOM-GAMMA must be positive.': () ->
      "RANDOM-GAMMA 的两个输入都必须为正。"

  , '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)': (n) ->
      "#{n} 不在随机数种子的可接受范围内 (-2147483648 ~ 2147483647)"

  , '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
      "#{n} 太大了，无法在 NetLogo 中以整数形式表达。"

  , 'List is empty.': () ->
      "列表为空。"

  , 'Can_t find element _ of the _ _, which is only of length _.': (n, type, list, length) ->
      "找不到 #{type} #{list} 的第 #{n} 个成员，因为列表的长度只有 #{length}。"

  , 'The list argument to reduce must not be empty.': () ->
      "用于 reduce 的列表参数不能为空。"

  , '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
      "#{endIndex} 大于输入列表的长度 (#{listLength})。"

  , '_ is less than zero.': (index) ->
      "#{index} 小于 0。"

  , '_ is less than _.': (endIndex, startIndex) ->
      "#{endIndex} 小于 #{startIndex}。"

  , '_ got an empty _ as input.': (prim, type) ->
      "#{prim} 的 #{type} 输入为空。"

  , '_ isn_t greater than or equal to zero.': (index) ->
      "#{index} 需要大于或等于 0。"

  , 'Can_t find the _ of a list with no numbers: __': (aspect, list, punc) ->
      "在不存在数字的列表 #{list}#{punc} 中找不到 #{aspect}。"

  , 'Requested _ random items from a list of length _.': (count, length) ->
      "无法从一个长度为 #{length} 的列表中取出 #{count} 个随机项。"

  , 'Requested _ random agents from a set of only _ agents.': (count, size) ->
      "无法从一个只有 #{size} 项的主体集合中取出 #{count} 个随机主体。"

  , 'Can_t find the _ of a list without at least two numbers: __': (aspect, list, punc) ->
      "#{list}#{punc} 中至少需要两个数字，才能用来找到 #{aspect}。"

  , 'Invalid list of points: _': (points) ->
      "坐标列表 #{points} 无效。"

  , 'First input to _ can_t be negative.': (prim) ->
      "#{prim} 的第一个输入不能为负。"

  , '_ expected a true/false value from _, but got _ instead.': (prim, item, value) ->
    "#{prim} 希望从 #{item} 中得到 true/false 值，得到的却是 #{value}。"

  , '_ expected input to be a _ agentset or _ but got _ instead.': (prim, agentType, value) ->
    "#{prim} 的输入应为 #{agentType} 或其集合，得到的却是 #{value}。"

  , '_ expected input to be _ but got _ instead.': (prim, expectedType, actualType) ->
    "#{prim} 的输入应为 #{expectedType}，得到的却是 #{actualType}。"

  , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.': (prim, agentType, list, value) ->
    "#{prim} 的列表输入只能包含其它列表、#{agentType}、或 #{agentType} 的集合。但是，列表 #{list} 中的值 #{value} 不属于上述类别。"

  , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.': (prim, agentType, list, value) ->
    "#{prim} 的列表输入只能包含其它列表、#{agentType}、或 #{agentType} 的集合。但是，列表 #{list} 包括了不同种类的主体集合: #{value}。"

  , 'SORT-ON works on numbers, strings, or agents of the same type, but not on _ and _': (type1, type2) ->
    "SORT-ON 可以用于数字、字符串或同类型的主体，但不能用于 #{type1} 或 #{type2}。"

  , 'anonymous procedure expected _ input_, but only got _': (needed, given) ->
    "匿名函数需要 #{needed} 个输入，得到的却只有 #{given} 个。"

  , 'REPORT can only be used inside TO-REPORT.': () ->
    "REPORT 只能在 TO-REPORT 中使用。"

  , 'STOP is not allowed inside TO-REPORT.': () ->
    "不能在 TO-REPORT 中使用 STOP。"

  , 'Reached end of reporter procedure without REPORT being called.': () ->
    "在函数结束时，应当使用 `REPORT` 进行输出。"

  , '_ doesn_t accept further inputs if the first is a string': (primName) ->
    "如果第一个输入是字符串，#{primName} 无法接受更多输入。"

  , 'Unfortunately, no perfect equivalent to `_` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.': (primName) ->
    "抱歉，海龟实验室中无法实现 `#{primName}`。不过，例如 `import-a` 和 `fetch` 这样的扩展可以实现你需要的功能。"

  , 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.': (x, y) ->
    "坐标 [ #{x} , #{y} ] 位于世界边缘之外，并且相应方向的世界环绕没有启用。"

  , 'Cannot move turtle beyond the world_s edge.': () ->
    "无法将海龟移动到世界边缘之外。"

  , 'there is no heading of a link whose endpoints are in the same position': () ->
    "两个端点位置相同的链接不存在朝向角度。"

  , 'No heading is defined from a point (_,_) to that same point.': (x, y) ->
    "从 (#{x},#{y}) 到同一个位置之间不存在朝向角度。"

  , '_ is not an integer': (x) ->
    "#{x} 不是整数。"

  , '_ is not a _': (breed1, breed2) ->
    "#{breed1} 不是 #{breed2}。"

  , 'An rgb list must contain 3 numbers 0-255': ->
    '一个 RGB 颜色列表必须包含 3 个 0-255 之间的数字。'

  , 'An rgb list must contain 3 or 4 numbers 0-255': ->
    '一个 RGB 颜色列表必须包含 3-4 个 0-255 之间的数字。'

  , 'RGB values must be 0-255': ->
    'RGB 值必须介于 0-255 之间。'

  , "can't set _ variable _ to non-number _": (e) ->
    "无法将 #{e.myType} 类型的变量 #{e.varName.toUpperCase()} 设置为非数字 #{e.target}"

  , '_ breed does not own variable _': (breedName, varName) ->
    "种类 #{breedName} 中并未定义参数 #{varName}"

  , 'All the list arguments to _ must be the same length.': (primName) ->
    "#{primName} 的所有列表参数必须长度相同。"

  , 'The step-size for range must be non-zero.': () ->
    "区间的步进大小不能为零。"

  , 'range expects at most three arguments': () ->
    "区间最多只接受三个参数。"

  , '_ cannot take a negative number.': (primName) ->
    "#{primName} 不能取负值。"

  # Dynamic Calls (TU)
  , 'Cannot find the procedure _.': (procedureName) ->
    "无法找到函数 #{procedureName}."
}

module.exports = bundle
