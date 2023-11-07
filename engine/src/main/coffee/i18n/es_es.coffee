bundle = {

  identifier: 'es_es'

, 'atan is undefined when both inputs are zero.': () ->
    "atan no puede tomar dos ceros por input."

, '_ isn_t a valid base for a logarithm.': (b) ->
    "#{b} no esta un base valido para el logarithm."

, 'The square root of _ is an imaginary number.': (n) ->
    "El square root de #{n} esta un numero imaginario."

, 'Division by zero.': () ->
    "No se puede dividir con 0."

, 'Can_t take logarithm of _.': (n) ->
    "No puede tomar un logarithm de #{n}."

, 'random-normal_s second input can_t be negative.': () ->
    "El segundo input de random-normal no puede ser negativo."

, '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
    "#{n} es demasiado grande para estar representado como un Integer en NetLogo."

, 'List is empty.': () ->
    "No hay nada en el listo."

, 'Can_t find element _ of the _ _, which is only of length _.': (n, type, list, length) ->
    "No puede esconder elemento #{n} del listo #{type} que solamente tiene #{list} miembros."

, 'The list argument to reduce must not be empty.': () ->
    "El listo para hacer 'reducto' no debe ser vacio."

, '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
    "#{endIndex} es mas que el longitud del listo de input (#{listLength})."

, '_ is less than zero.': (index) ->
    "#{index} es menos que cero."

, '_ got an empty _ as input.': (prim, type) ->
    "#{prim} recibio un listo sin miembros."

, '_ isn_t greater than or equal to zero.': (index) ->
    "#{index} no esta mas que o iqual a cero."

, 'Can_t find the _ of a list with no numbers: __': (aspect, list, punc) ->
    "No puede esconder el promedio de un listo sin numeros: #{aspect}."

, 'Requested _ random items from a list of length _.': (count, length) ->
    "Escondiendo #{count} miembros al azar del listo de longitud #{length}."

, 'Requested _ random agents from a set of only _ agents.': (count, size) ->
    "Pidió a #{count} agentes azar de un conjunto de sólo #{size} agentes."

, 'Can_t find the _ of a list without at least two numbers: __': (aspect, list, punc) ->
    "No puede esconder el variance de un listo que tiene por lo menos dos numeros: #{aspect}."

, 'Invalid list of points: _': (points) ->
    "Esta lista de puntos no es valido: #{points}"

, 'First input to _ can_t be negative.': (prim) ->
    "El primero input a #{prim} no puede ser negativo."

, '_ expected a true/false value from _, but got _ instead.': (prim, item, value) ->
    "#{prim} expectabla un verdad/falso valor de #{item}, pero encuentro #{value} en vez."

, 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.': (prim, agentType, list, value) ->
    "Los inputs del listo #{prim} solamente puede contener un #{agentType}, #{agentType} agentset, o elementos de un listo. "

, 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.': (prim, agentType, list, value) ->
    "Los inputs de #{prim} olamente puede contener un link, link agentset, o elementos de un listo.  El listo #{agentType} contiene un otro tipo de agentset: #{list}."

, 'REPORT can only be used inside TO-REPORT.': () ->
    "solamente se puede usar REPORT en TO-REPORT."

, 'STOP is not allowed inside TO-REPORT.': () ->
    "STOP no esta permitido entre TO-REPORT."

, 'Reached end of reporter procedure without REPORT being called.': () ->
    "Llego al terminacion del procedimiento de reporter sin llamando REPORT."

, 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.': (x, y) ->
    "El punto [ #{x} , #{y} ] es fuera de los limites de ese mundo y  wrapping no esta permitido en uno o mas de los direcions."

, 'Cannot move turtle beyond the world_s edge.': () ->
    "No se puede mover la tortuga más allá del borde del mundo."

, 'there is no heading of a link whose endpoints are in the same position': () ->
    "No hay un heading de un link que tiene endpoints en el mismo lugar."

, 'No heading is defined from a point (_,_) to that same point.': (x, y) ->
    "No hay un heading definido desde punto (#{x},#{y}) a si mismo."

, 'An rgb list must contain 3 numbers 0-255': () ->
    "rgb una lista deberá contener tres números de 0 a 255"

, 'An rgb list must contain 3 or 4 numbers 0-255': () ->
    "Una lista rgb debe contener 3 o 4 números de 0 a 255"

, 'RGB values must be 0-255': () ->
    "valores RGB debe 0-255"

, '_ breed does not own variable _': (breedName, varName) ->
    "#{breedName} breed no tiene variable #{varName}"

, 'All the list arguments to _ must be the same length.': (primName) ->
    "Todos los argumentos lista para #{primName} debe tener la misma longitud."

, '_ cannot take a negative number.': (primName) ->
    "#{primName} no puede tomar un numero negativo."
}

module.exports = bundle
