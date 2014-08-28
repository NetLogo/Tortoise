(ns test.cljs.lib-tests
  (:require [test.cljs.benchmarker :refer [basic-bench report]]))

(defn inf-keywords
  ([] (inf-keywords 1))
  ([k] (cons (keyword (str "k" k)) (lazy-seq (inf-keywords (inc k))))))

(defn n-kvs [n]
  (interleave (take n (inf-keywords)) (take n (range))))

(defn partition-test
  ([nkvs] (partition-test nkvs 100))
  ([nkvs iters]
    (let [kvs (n-kvs nkvs)
          partition-all_t (basic-bench iters #(doall (partition-all 2 kvs)))
          apply-hash-map_t (basic-bench iters #(apply hash-map kvs))]
      (report "apply-hash-map_t MINUS partition-all_t: " (- apply-hash-map_t partition-all_t)))))

(defn run-tests []
  (report "10 kvs")
  (partition-test 10 10000)
  (report "100 kvs")
  (partition-test 100 10000)
  (report "100000 kvs")
  (partition-test 100000))

;; apply hash-map definitely appears faster (esp. for large sets) -- JTT (8/28/14)
