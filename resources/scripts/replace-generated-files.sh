rm compiler/shared/src/main/scala/json/generated/*Writer.scala
rm compiler/shared/src/main/scala/json/generated/*Reader.scala
mv target/gen-shared/*Writer.scala compiler/shared/src/main/scala/json/generated/
mv target/gen-shared/*Reader.scala compiler/shared/src/main/scala/json/generated/

rm compiler/js/src/main/scala/json/generated/*Writer.scala
rm compiler/js/src/main/scala/json/generated/*Reader.scala
mv target/gen-js/*Writer.scala compiler/js/src/main/scala/json/generated/
mv target/gen-js/*Reader.scala compiler/js/src/main/scala/json/generated/
