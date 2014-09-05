(ns test.cljs.filtering
  (:require [test.cljs.benchmarker :refer [report basic-bench]]
            [test.cljs.lib-tests :refer [n-kvs]]
            [clojure.core.reducers :as r]))

(defn turtle-like-obj [id breed]
  (apply assoc
   {:name "turtle"
   :breed {:type breed :breed-manager {:do-other-stuff (fn [] "pfffft")}}
   :getBreedName (fn [] breed)
   :id id
   :to-string (fn [] "(turtle-like-obj 0 0)")
   :xcor 0
   :ycor 0
   :world {}} (n-kvs 10)))

(defn inf-turtle-like-objs
  ([breed]   (inf-turtle-like-objs 0 breed))
  ([n breed] (cons (turtle-like-obj n breed) (lazy-seq (inf-turtle-like-objs (inc n))))))

(defn n-fake-turtles
  ([n] (n-fake-turtles n "TURTLES"))
  ([n breed] (take n (inf-turtle-like-objs breed))))

(defn n-turtles-and-jedi [n]
  (set (concat (n-fake-turtles n) (n-fake-turtles n "JEDI KNIGHTS"))))

(defn reducer-set-filter [breedset breed-name]
  (into-array (r/filter #(= ((:getBreedName %)) breed-name) (vec breedset))))

(defn js-set-filter [breedset breed-name]
  (.filter (into-array breedset) #(= ((:getBreedName %)) breed-name)))

(defn reducers-vs-js
  ([n iters]
   (let [turtleset (n-turtles-and-jedi n)
         reducer_t (basic-bench iters #(reducer-set-filter turtleset "JEDI KNIGHTS"))
         js_t      (basic-bench iters #(js-set-filter turtleset "JEDI KNIGHTS"))]
     (report "reducer_t MINUS js_t = " (- reducer_t js_t))))
  ([n] (reducers-vs-js n 100000)))

(defn run-tests []
  (reducers-vs-js 10)
  (reducers-vs-js 100)
  (reducers-vs-js 100000))
