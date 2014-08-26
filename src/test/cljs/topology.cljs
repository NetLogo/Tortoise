(ns test.cljs.topology
  (:require [topology.torus :as torus]))

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

(defn basic-bench [expr]
  (let [t   (time-n-times     100000 expr)
        avg (avg-time-n-times 100000 expr)]
    (log-time t)
    (log-avg-time avg)
    t))

(defn get-each-patch [gp]
   (doall
    (for [n (range -5 6)
          m (range -5 6)]
      (do
        (gp n m)))))

(defn run-tests []
  ;; inst
  ;;(report "inst")
  ;;(basic-bench (fn [] (torus/torus -5 5 -5 5)))

  (let [t (torus/torus -5 5 -5 5)]
    ;; get patch
    (report "Get Patch 0 0")
    (basic-bench (fn [] ((t :get-patch) 0 0)))
    (report "Get Patch -5 -5")
    (basic-bench (fn [] ((t :get-patch) -5 -5)))
    (report "Get Patch 5 5")
    (basic-bench (fn [] ((t :get-patch) 5 5)))
    (report "Get each patch")
    (basic-bench (fn [] (get-each-patch (t :get-patch))))
    ;; test reference delay (?)
    (report "Diffuse delay?")
    (let [jst   (basic-bench (fn [] (.diffuse (t :_spliced-topology) "jam" 0.5)))
          cljst (basic-bench (fn [] ((t :diffuse) "jam" 0.5)))]
      (report "JS time - CLJS time: " (- jst cljst)))
    ;; midpointx
    (report "midpointx")
    (report "JS")
    (basic-bench (fn [] (.midpointx (t :_spliced-topology) -3 3)))
    (report "cljs")
    (basic-bench (fn [] ((t :midpointx) -3 3)))
    ;; distanceXY
    (report "find distance between every pair of points.")
    (report "distance-xy js")
    (basic-bench (fn [] (doall (for [n (range -5 5)
                              m (range -5 5)]
                          (.distanceXY (t :_spliced-topology) m n)))))
    (report "distance-xy cljs")
    (basic-bench (fn [] (doall (for [n (range -5 5)
                                     m (range -5 5)]
                                    ((t :distance-xy) m n)))))))
