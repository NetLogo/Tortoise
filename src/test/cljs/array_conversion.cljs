(ns test.cljs.array-conversion
  (:require [test.cljs.benchmarker :refer [report basic-bench]]))

(defn random-vec [vsize maxint]
  (take vsize (repeatedly #(rand-int maxint))))

(defn arr-conv-test [arrsize iters]
  (let [maxint       1000000
        into-array_t (basic-bench iters #(into-array (random-vec arrsize maxint)))
        apply-array_t (basic-bench iters #(apply array (random-vec arrsize maxint)))]
    (report "apply-array_t MINUS into-array_t: " (- apply-array_t into-array_t))))

(defn run_tests []
  (report "arrsize 100 iters 100000")
  (arr-conv-test 100 100000)
  (report "1000x1000")
  (arr-conv-test 1000 1000)
  (report "100000x100")
  (arr-conv-test 100000 100)
  (report "1000000x100")
  (arr-conv-test 1000000 100))
