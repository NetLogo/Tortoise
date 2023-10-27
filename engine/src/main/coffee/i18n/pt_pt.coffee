
bundle = {

  identifier: 'pt_pt'

    , 'atan is undefined when both inputs are zero.': () ->
      "atan é indefinido quando ambas as entradas são zero."

    , '_ isn_t a valid base for a logarithm.': (b) ->
        "#{b} não é uma base válida para um logaritmo."

    , 'The square root of _ is an imaginary number.': (n) ->
        "A raiz quadrada de #{n} é um número imaginário."

    , 'Division by zero.': () ->
        "Divisão por zero."

    , 'Can_t take logarithm of _.': (n) ->
        "Não é possível encontrar o logaritmo de #{n}."

    , 'random-normal_s second input can_t be negative.': () ->
        "a segunda entrada de random-normal não pode ser negativa."

    , '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
        "#{n} é muito largo para ser representado exatamente como um inteiro no NetLogo."

    , 'List is empty.': () ->
        "A lista está vazia."

    , 'Can_t find element _ of the _ _, which is only of length _.': (n, type, list, length) ->
        "Não foi possível encontrar o elemento #{n} da lista #{type}, que tem comprimento de apenas #{list}."

    , 'The list argument to reduce must not be empty.': () ->
        "O argumento de lista para 'reduce' não pode ser vazio."

    , '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
        "#{endIndex} é maior que o comprimento da lista de entrada (#{listLength})."

    , '_ is less than zero.': (index) ->
        "#{index} é menor que zero."

    , '_ got an empty _ as input.': (prim, type) ->
        "#{prim} recebeu uma lista vazia como entrada."

    , '_ isn_t greater than or equal to zero.': (index) ->
        "#{index} não é maior ou igual a zero."

    , 'Requested _ random items from a list of length _.': (count, length) ->
        "Foram pedidos #{count} itens aleatórios de uma lista de comprimento #{length}."

    , 'Requested _ random agents from a set of only _ agents.': (count, size) ->
        "Foram pedidos #{count} agentes aleatórios de um conjunto com apenas #{size} agentes."

    , 'Can_t find the _ of a list without at least two numbers: __': (aspect, list, punc) ->
        "Não é possível encontrar a variância de uma lista sem pelo menos dois números: #{aspect}."

    , 'Invalid list of points: _': (points) ->
        "Lista de pontos inválida: #{points}"

    , 'First input to _ can_t be negative.': (prim) ->
        "A primeira entrada para #{prim} não pode ser negativa."

    , '_ expected a true/false value from _, but got _ instead.': (prim, item, value) ->
        "#{prim} esperava um valor de verdadeiro/falso (true/false) de #{item}, mas no lugar disso recebeu #{value}."

    , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.': (prim, agentType, list, value) ->
        "Entradas de lista para #{prim} devem somente conter link, link agentset, ou elementos de lista.  A lista #{agentType} continha #{list} que NÃO é um link ou link agentset."

    , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.': (prim, agentType, list, value) ->
        "Entradas de lista para #{prim} devem somente conter link, link agentset, ou elementos de lista.  A lista #{agentType} continha um tipo diferente de agentset: #{list}."

    , 'anonymous procedure expected _ inputs, but only got _': (needed, given) ->
        "o procedimento anônimo esperava 1 entrada, mas obteve apenas 0"

    , 'REPORT can only be used inside TO-REPORT.': () ->
        "REPORT só pode ser usado dentro de TO-REPORT."

    , 'STOP is not allowed inside TO-REPORT.': () ->
        "STOP não é permitido dentro de TO-REPORT."

    , 'Reached end of reporter procedure without REPORT being called.': () ->
        "Chegou-se ao fim de um procedimento reporter sem que REPORT tenha sido chamado."

    , 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.': (x, y) ->
        "O ponto [ #{x} , #{y} ] está fora dos limites do mundo e dar a volta no mundo não é permitido em uma ou mais direções."

    , 'Cannot move turtle beyond the world_s edge.': () ->
        "Não se pode mover a turtle para além da fronteira do mundo."

    , 'there is no heading of a link whose endpoints are in the same position': () ->
        "Não há um heading de um link no qual as pontas estejam na mesma posição."

    , 'No heading is defined from a point (_,_) to that same point.': (x, y) ->
        "Não é possível determinar um heading do ponto (#{x},#{y}) para esse mesmo ponto."

    , 'An rgb list must contain 3 numbers 0-255': () ->
        "Uma lista RGB deve conter 3 números 0-255"

    , 'An rgb list must contain 3 or 4 numbers 0-255': () ->
        "Uma lista RGB deve conter 3 ou 4 números 0-255"

    , 'RGB values must be 0-255': () ->
        "Valores RGB devem ser 0-255"

    , '_ breed does not own variable _': (breedName, varName) ->
        "#{breedName} breed não possui a variável #{varName}"

    , 'All the list arguments to _ must be the same length.': (primName) ->
        "Todos os argumentos de lista para #{primName} devem ter o mesmo comprimento."

    , 'The step-size for range must be non-zero.': () ->
        "O tamanho de degrau para range deve ser diferente de zero."

    , '_ cannot take a negative number.': (primName) ->
        "#{primName} não pode ter número negativo."

  }

module.exports = bundle
