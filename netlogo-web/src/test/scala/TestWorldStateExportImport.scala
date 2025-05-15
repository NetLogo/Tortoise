// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.nlogo.core.{ Model, View }

import
  org.nlogo.tortoise.compiler.CompiledModel

import
  scala.io.Source

class TestWorldStateExportImport extends SimpleSuite {

  private lazy val model = {
    val input = Source.fromFile("resources/test/models/ExtensionStateTest.nlogo")
    val nlogo = input.mkString
    input.close()
    CompiledModel.fromNlogoContents(nlogo, compiler) valueOr
      ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
  }

  test("exportValue works for the basics") { fixture =>
    val exportValueCode  = """
      globals [a b c x y z]
      to setup-turtles
        create-turtles 10 [ fd 100 set color one-of [red blue green] ]
      end
    """
    val exportValueModel = Model(code = exportValueCode, widgets = List(View.square(1)))
    val compiledModel = CompiledModel.fromModel(exportValueModel, compiler) valueOr
      ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
    fixture.eval(compiledModel.compiledCode)

    val evalCmd = (command) =>
      evalModel(command, compiledModel.compileRawCommand)

    evalCmd("random-seed 90210")
    evalCmd("setup-turtles")
    evalCmd("set a 154")
    evalCmd("set b \"154\"")
    evalCmd("set c [10 20 30 40 50]")
    evalCmd("set x one-of turtles")
    evalCmd("set y sort turtles with [color = blue]")
    evalCmd("set z [other turtles-here] of turtles with [color = green]")

    fixture.eval("var createExportValue = tortoise_require('engine/core/world/export').createExportValue")
    fixture.eval("var exportValue       = createExportValue(workspace.world)")
    val expectedGlobals = Map(
      "a" -> "154"
    , "b" -> """"154""""
    , "c" -> """[10,20,30,40,50]"""
    , "x" -> """{"agentType":"turtle","who":2,"color":{"value":15},"heading":205,"xcor":-0.2618261740699275,"ycor":-0.6307787036650048,"shape":"default","label":"","labelColor":{"value":9.9},"breed":{"breedName":"turtles"},"isHidden":false,"size":1,"penSize":1,"penMode":"up","breedsOwns":{}}"""
    , "y" -> """[{"agentType":"turtle","who":6,"color":{"value":105},"heading":224,"xcor":-0.46583704589973585,"ycor":0.06601996613489192,"shape":"default","label":"","labelColor":{"value":9.9},"breed":{"breedName":"turtles"},"isHidden":false,"size":1,"penSize":1,"penMode":"up","breedsOwns":{}},{"agentType":"turtle","who":9,"color":{"value":105},"heading":27,"xcor":0.3990499739546749,"ycor":-0.8993475811632083,"shape":"default","label":"","labelColor":{"value":9.9},"breed":{"breedName":"turtles"},"isHidden":false,"size":1,"penSize":1,"penMode":"up","breedsOwns":{}}]"""
    , "z" -> """[{"agentSetType":"turtleset","references":[{"referenceType":"turtle","breed":{"singular":"turtle","plural":"turtles"},"id":6}]},{"agentSetType":"turtleset","references":[{"referenceType":"turtle","breed":{"singular":"turtle","plural":"turtles"},"id":8}]},{"agentSetType":"turtleset","references":[]}]"""
    )
    expectedGlobals.foreach({ case (global, expected) =>
      val actual = fixture.eval(s"JSON.stringify(exportValue(workspace.world.observer.getGlobal('$global')))")
      assert(expected == actual, s"testing global $global")
    })
  }

  test("array-only objects don't blow up") { fixture =>
    val arrayModel = Model(code = "extensions [array export-the import-a] globals [x y z]", widgets = List(View.square(1)))
    val compiledModel = CompiledModel.fromModel(arrayModel, compiler) valueOr
      ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
    fixture.eval(compiledModel.compiledCode)

    evalModel("random-seed 10210", compiledModel.compileRawCommand)
    evalModel("set x array:from-list [ 0 10 20 30 40 50 ]", compiledModel.compileRawCommand)
    assert("{{array: 0 10 20 30 40 50}}" == evalModel("(word x)", compiledModel.compileReporter))

    fixture.eval("var state = workspace.world.exportState()")
    fixture.eval("workspace.world.clearAll()")
    fixture.eval("workspace.world.importState(state)")
    assert("{{array: 0 10 20 30 40 50}}" == evalModel("(word x)", compiledModel.compileReporter))

    evalModel("set y export-the:world", compiledModel.compileRawCommand)
    val expectedArrayExport =
      """
"RANDOM STATE"
"0 0 -1727483681 624 0.0 false 10210 -2070565333 2019600175 836473641 2139160625 -1739668747 -970319239 -400704471 1519629978 725417520 -429393670 1712421704 -891374375 580649999 -1776115463 246208022 1801206974 -182505876 2117056733 818260703 -964247281 -942828079 -1979220496 16331409 1280805965 -558692843 494742728 953266947 -862110901 -575018107 -233922052 1450205370 -952681241 43846165 887961451 2083266650 -516524277 -1587003827 2141314129 -1074611273 522906513 -520713890 -1370360101 -278952760 -733149373 772086893 -1489662929 1902076656 657195589 762761834 -10371580 913487862 -1351665086 1422801781 1666877690 1222860350 -1763908077 851238382 -1865814752 58704037 -1610461611 892762000 694762510 873082821 1710769657 -1574087911 -417841943 -2020654443 -1404496681 -2100415154 2062857026 -1588685642 -1300168884 1487370255 -910959664 -614554230 -2052284327 -446105804 -1523124223 -1518439298 1990086972 2056958562 -852206495 -641276675 -956938614 78128482 805712384 -1590445481 1014169825 1459536414 188624277 -788547292 -754259009 -577069687 -1290468912 -1979639239 -1525289817 -238179718 732824351 -2060725602 -1874619408 947118303 -2094526623 1589579126 836108123 -1903005104 1462959300 -1245305052 -601175958 -1996471590 617084838 1408666349 1829837708 1817793554 -574531855 1835847661 -1498983280 876904463 469208417 1291497660 413655049 2103391494 -786322627 1570684401 1423335468 -817428674 -1198489457 631844128 549776928 1409356577 -1115116510 535365923 1355372115 -1830883105 317082807 15414202 495973098 254808283 -1862739471 -663353238 401638137 -926290486 -1804967461 -1253786580 -636166986 -1723141894 -867317142 283249920 -47963756 -732164056 -1574542195 -1730202622 786662552 31500433 -1076946225 -1180153732 1906444370 -911821732 -941293287 1789286881 249189888 237629089 2040942375 822251681 -1781515991 1038848412 1243672370 -312104250 -656224927 -418219437 636424762 -542557299 1468366258 -338402484 -1088850471 -1575308522 -1813357676 -1886164769 -1571707677 697923192 1731851788 -186251050 -749831745 20947939 -872078265 -330583155 -1915300416 -1636489147 1152902079 -408975181 -1092149714 1669887003 1873656066 1520540144 515552727 -1210397290 -1335668696 -1506075817 -767211953 67594435 -1353600841 331257138 -194601084 -1467142130 1857970568 168676570 -334988080 401287950 1597274966 -1189660380 197714640 458411235 1971671395 1205112447 613394060 -358505965 1072660776 -843817567 -1783454780 -1417047047 1029027299 -832815508 1356269993 479836199 155420483 -1042532016 -338359903 -1465745459 1361785999 2098051819 -2082997960 -517251383 -614694758 478125638 1710680200 -2070278152 -1423239026 1408736297 -933624650 -1258571432 653740914 -552679701 966697594 -1981848299 1776103943 171176787 2130406325 -2017406213 -1865843147 -1685374036 -358569312 -81162678 76100809 1960863050 -1681253739 219696530 -484983398 134459230 -1780515048 770183237 -618243779 -1802148741 1560569283 -1384187759 908312071 -1560495924 -2109921200 -822949019 745395786 1661543999 734348676 1839469091 -430089606 1569616846 -1546225475 1265949550 579992287 -1292742128 503579696 1529042951 -818482826 504881474 -1480183260 -1458429927 -1408098621 -656249790 520781763 -1613183986 2109982172 137057874 1586033020 -340906892 -1664861417 1453100398 -1518521103 1113649158 -1797033237 -426113002 2108386931 1876661797 -268992160 1855522876 2104747583 -123533915 -2048847442 1341457933 -432287762 -2091262284 -912374526 -1922710630 -1208318930 -742018413 -75594744 769719440 685553162 1858415917 86728600 -43184075 -1825682292 -669109435 1548005854 459507004 87338478 1751055913 -694833396 -517596880 1810447717 1117502907 1209034154 546152640 136785162 -1579868099 1561358631 -1542194357 408630811 1252904182 1208159683 1138704603 -21020332 1489852326 -964889289 -755920167 2094766936 -1808405388 -1811189274 -709692339 -1434836448 -446584123 -145336454 976176410 475475616 -1665595777 -1025280591 -308825445 -309014694 -1776586624 -745081170 -11736922 -631564417 -639262381 68974072 -1272691647 -1666463015 -1353499438 554848124 1428601177 -2099300058 -677261149 -539168624 653170288 1739803554 -1297345598 515214388 185869817 1024736691 568730646 -843709402 1242198290 -400111367 1337005597 -1602832760 206299119 1750024649 -1108279961 1903298393 458424121 954414079 141556766 -823359654 1999571106 832742613 -46922096 -284146553 -1783517795 -128149435 1005554473 -249964103 1624076783 -1467461004 2065936413 1326938268 1276746882 1181867073 -1081465133 -1140970743 27058156 1177396658 697576502 -1332193050 -773253235 460540576 298586811 -1566148509 2025875682 1044373037 -866927008 1721899439 1500791111 -759809984 1943342866 631578403 -708573836 -1752967015 -1507038770 1220012836 661230658 -221457996 1460317662 -480513625 -1290593439 1676069565 -944727589 -1612100632 -1139724541 435557911 1049233350 1225263314 1588160500 892019295 335702066 538173298 2122918835 -1637973772 1560709321 1346306212 11964374 836388652 -43474405 -2018587336 677446563 -1230132207 -1138749374 -753358076 494090888 1115742574 864442770 1156479586 -297122344 262980657 -1384209888 -22533322 32205494 1895203228 1139354048 580699125 1147825786 -595956903 1731561045 2035086584 -918230766 -731836789 -2134276737 173838633 -464308218 1106430163 134192821 -1497662395 2003503328 -1893602397 -52289180 652758659 356521616 206305458 1726898717 -1387154704 379395423 -498241695 483812753 266841373 970380122 -2007855508 1137512785 -1218730372 414457763 -982271939 99803237 296457929 -1209855938 -773225058 -1393705500 -1380580430 1251518053 -603903126 -393194652 -1184626533 1967146838 1340782157 792500727 2064576367 2131252835 1228048552 -189702740 -656040181 770377769 1782000431 69314857 -1863471055 -1233727196 1389878276 1410039040 628415597 1410092554 -2064928927 562900762 211714382 1054720979 -636539059 1534093781 -1865926988 -1958806049 -759140541 741680723 -222327853 -636191963 1711664660 -883741344 -1127226073 -1616300366 1255589258 -2126490382 -26872628 -203071800 885394229 2023017224 -1936003667 -1239716052 -107709112 -5270598 -329102559 1122687119 -395481044 696216498 -1715093150 1226943753 -82145710 1473937696 204905777 67256194 1567466104 92462316 -816875700 -396600484 -1393629779 787760958 1530022826 453205932 -1539584750 667253127 -1516031109 608047606 -908870072 -915588910 -1523169871 -1516548900 880419796 2083035363 1006847338 190193427 1830842305 2010765571 -1524452850 -1504924415 -1544822923 921099066 -1426290134 1118432273 1892594842 1953576562 -2014115669 992206330 281501680 814763007 160593131 2110187016 651334879 685315406 -953276390 -312855246 191182763 1399225294 1985585667 -283246813 -566375942 1363538584 -1382311495 -607798236 533011649 980329348 1808017780 -54068598 -598529169 788590591 801581311 561817088 1963163750 15321610 933368410 658074091 1019383585 -314432656 2083883467 -1537050337 427118559 371186794"

"GLOBALS"
"min-pxcor","max-pxcor","min-pycor","max-pycor","perspective","subject","nextIndex","directed-links","ticks","x","y","z"
"-1","1","-1","1","0","nobody","0",""" + "\"\"\"NEITHER\"\"\"" + ""","-1","{{array: 0}}","0","0"

"TURTLES"
"who","color","heading","xcor","ycor","shape","label","label-color","breed","hidden?","size","pen-size","pen-mode"

"PATCHES"
"pxcor","pycor","pcolor","plabel","plabel-color"
"-1","1","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"0","1","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"1","1","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"-1","0","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"0","0","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"1","0","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"-1","-1","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"0","-1","0",""" + "\"\"\"\"\"\"" + ""","9.9"
"1","-1","0",""" + "\"\"\"\"\"\"" + ""","9.9"

"LINKS"
"end1","end2","color","label","label-color","hidden?","breed","thickness","shape","tie-mode"


"OUTPUT"
"PLOTS"
""
"EXTENSIONS"

"array"
"{{array: 0: 0 10 20 30 40 50}}"

"""
    assert(expectedArrayExport == engine.eval("world.observer.getGlobal('y').split('\\n').slice(3).join('\\n')"))

    evalModel("set x 0", compiledModel.compileRawCommand)
    evalModel("import-a:world y", compiledModel.compileRawCommand)
    assert("{{array: 0 10 20 30 40 50}}" == evalModel("(word x)", compiledModel.compileReporter))
  }

  test("creating extension objects doesn't blow up") { fixture =>
    fixture.eval(model.compiledCode)
    evalCommand("make-extension-objects")

    val arr = s"""{{array: (agentset, 50 turtles) (agentset, 25 patches)}}"""
    val mat = s"""{{matrix:  [ [ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ] ]}}"""
    val nlm = s"""{{nlmap:  ["gold" ${arr}] ["silver" 100] ["bronze" false]}}"""
    val tab = s"""{{table: [["apples" [0 10 20]] ["oranges" ["monkey" "purple" "dishwasher"]] ["plums" true]]}}"""
    val lis = s"""[10 ${tab} true balloons ${arr} ${mat} ${nlm}]"""
    assert(arr == evalReporter("(word arr)"))
    assert(mat == evalReporter("(word mat)"))
    assert(nlm == evalReporter("(word nlm)"))
    assert(tab == evalReporter("(word tab)"))
    assert(lis == evalReporter("(word lis)"))
  }

  test("extension objects remain unchanged with world state export and import") { fixture =>
    fixture.eval(model.compiledCode)
    evalCommand("make-extension-objects")
    fixture.eval("var state = workspace.world.exportState()")
    fixture.eval("workspace.world.clearAll()")
    fixture.eval("workspace.world.importState(state)")

    assert(fixture.eval("world.observer.getGlobal('nlm').gold === world.observer.getGlobal('arr')") === true)

    val arr = s"""{{array: (agentset, 50 turtles) (agentset, 25 patches)}}"""
    val mat = s"""{{matrix:  [ [ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ] ]}}"""
    val nlm = s"""{{nlmap:  ["gold" ${arr}] ["silver" 100] ["bronze" false]}}"""
    val tab = s"""{{table: [["apples" [0 10 20]] ["oranges" ["monkey" "purple" "dishwasher"]] ["plums" true]]}}"""
    val lis = s"""[10 ${tab} true balloons ${arr} ${mat} ${nlm}]"""
    assert(arr == evalReporter("(word arr)"))
    assert(mat == evalReporter("(word mat)"))
    assert(nlm == evalReporter("(word nlm)"))
    assert(tab == evalReporter("(word tab)"))
    assert(lis == evalReporter("(word lis)"))

    evalCommand("array:set arr 0 (n-of 33 turtles)")
    val arr33 = s"""{{array: (agentset, 33 turtles) (agentset, 25 patches)}}"""
    val nlm33 = s"""{{nlmap:  ["gold" ${arr33}] ["silver" 100] ["bronze" false]}}"""
    assert(arr33 == evalReporter("(word arr)"))
    assert(nlm33 == evalReporter("(word nlm)"))
  }

  test("directed links survive state export and import") { fixture =>
    val linkCode = """
to test-directed-link
  clear-all
  create-turtles 2
  ask turtle 1 [ create-link-to turtle 0 ]
end
"""
    val linkModel = Model(code = linkCode, widgets = List(View.square(1)))
    val compiledModel = CompiledModel.fromModel(linkModel, compiler) valueOr
      ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
    fixture.eval(compiledModel.compiledCode)
    evalModel("test-directed-link", compiledModel.compileRawCommand)
    assert("(link 1 0)" == evalModel("(word one-of links)", compiledModel.compileReporter))

    fixture.eval("var state = workspace.world.exportState()")
    fixture.eval("workspace.world.clearAll()")
    fixture.eval("workspace.world.importState(state)")
    assert("(link 1 0)" == evalModel("(word one-of links)", compiledModel.compileReporter))
  }

  private def evalCommand(netlogo: String): AnyRef =
    evalModel(netlogo, model.compileRawCommand)

  private def evalReporter(netlogo: String): AnyRef =
    evalModel(netlogo, model.compileReporter)

  private def evalModel(netlogo: String, evaluator: (String) => CompiledModel.CompileResult[String]): AnyRef = {
    val result = evaluator(netlogo) valueOr ((nel) => throw new Exception(nel.list.toList.mkString))
    engine.eval(result)
  }

}
