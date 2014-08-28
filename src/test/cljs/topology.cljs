(ns test.cljs.topology
  (:require [test.cljs.benchmarker :refer [basic-bench report]]
            [topology.torus :as torus]))

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
