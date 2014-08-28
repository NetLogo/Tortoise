(ns test.cljs.vector-removal
  (:require [test.cljs.benchmarker :refer [basic-bench report]]))

(defn vec-splice
  ([v i] (if (= i 0)
            (rest v)
            (concat (subvec v 0 i) (subvec v (inc i))))))

(defn random-vec [vsize maxint]
  (take vsize (repeatedly #(rand-int maxint))))

(defn vec-test [vsize maxint]
  (let [v (random-vec vsize maxint)
        splice_t (basic-bench 100 #(vec-splice v (rand-int vsize)))
        remove_t (basic-bench 100 #(remove #{(rand-int maxint)} v))]
    (report "vec-splice MINUS remove: " (- splice_t remove_t) "ms")))

(defn run-tests []
  (report "100 elements 0-999999")
  (vec-test 100 1000000)
  (report "10000 elements 0-999999")
  (vec-test 10000 1000000)
  (report "100000 elements 0-999999")
  (vec-test 100000 1000000)
  (report "1000000 elements 0-999999")
  (vec-test 1000000 1000000))

;; "remove" is the unequivocal winner. -- JTT (8/28/14)
