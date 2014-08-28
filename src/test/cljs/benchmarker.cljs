(ns test.cljs.benchmarker)

(defn jstime [expr]
  (let [start (.now js/Date)]
    (expr)
    (- (.now js/Date) start)))

(defn time-n-times [n expr]
  (jstime (fn [] (dotimes [i n] (expr)))))

(defn avg-time-n-times [n expr]
  (/ (reduce + (for [i (range n)] (jstime expr))) n))

(defn report [& s]
  (.warn js/console (apply str s)))

(defn log-time [t]
  (.log js/console "Exec time (as per js/Date.now): " t "ms"))

(defn log-avg-time [t]
  (.log js/console "Avg time: " t "ms"))

(defn basic-bench
  ([expr] (basic-bench expr 100000))
  ([n expr]
   (let [t   (time-n-times    n expr)
        avg (avg-time-n-times n expr)]
    (log-time t)
    (log-avg-time avg)
    t)))
