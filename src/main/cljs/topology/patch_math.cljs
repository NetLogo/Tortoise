(ns topology.patch-math
  (:require [shim.strictmath]
            [shim.random]))

(defn wrap [pos mn mx]
  (cond
    ;; use >= to consistently return -5.5 for the "seam" of the
    ;; wrapped shape -- i.e., -5.5 = 5.5, so consistently
    ;; report -5.5 in order to have equality checks work
    ;; correctly. -- JTT (7/23/14)
    (>= pos mx) (+ mn (js-mod (- pos mx) (- mx mn)))
    (< pos mn)  (let [result (- mx (js-mod (- mn pos)
                                        (- mx mn)))]
                  (if (< result mx)
                    result
                    mn))
    :default pos))

;; dimension converter

(defn xy->i [x y arr w mnx mny]
  (nth (drop (* w (- (- y) mny)) arr) (- x mnx)))


;; edge-bounds helper

(defn compute-edges [mnx mxx mny mxy]
  {:min-pxcor (- mnx 0.5)
   :max-pxcor (+ mxx 0.5)
   :min-pycor (- mny 0.5)
   :max-pycor (+ mxy 0.5)})

;; shortest-x wraps a difference out of bounds.
;; _shortestX does not. -- JTT (7/28/14)
;; _shortestX is also gibberish. This implementation
;; completely fails tests. -- JTT (8/18/2014)

(defn shortest-x [x1 x2]
  (wrap-x (- x2 x1)))

(defn shortest-y [y1 y2]
  (wrap-y (- y2 y1)))

;; _shortestX/Y equivalent

(defn shortest-nonsense-helper [d1 d2 w-or-h]
  "Madness, this."
  (let [mag (.abs shim.strictmath (- d1 d2))
        negmod (if (> d2 d1) -1 1)
        negmod2 (if (> d1 d2) -1 1)]
    (if (-> mag (> (/ w-or-h 2)))
      (-> w-or-h (- mag) (* negmod))
      (* (.abs js/Math (- d1 d2)) negmod2))))

;; distances

(defn distance-helper [x1 y1 x2 y2 sx sy]
  (let [a2 (.pow shim.strictmath (sx x1 x2) 2)
        b2 (.pow shim.strictmath (sy y1 y2) 2)]
    (.sqrt shim.strictmath (+ a2 b2))))

;; towards

(defn towards [x1 y1 x2 y2 shortest-x shortest-y]
  (let [dx (shortest-x x1 x2)
        dy (shortest-y y1 y2)]
    (cond
     (= dx 0) (or (and (< dy 0) 180) 0)
     (= dy 0) (or (and (< dx 0) 270) 90)
     :default (-> (->> (.atan2 shim.strictmath (- dy) dx)
                       (+ (.-PI js/Math))
                       (.toDegrees shim.strictmath)
                       (+ 270))
                  (js-mod 360)))))

;; midpoints

(defn midpoint [d1 d2 shortest-fn]
  (-> (+ d1 (+ d1 (shortest-fn d1 d2))) (/ 2)))

;; in-radius

;; NOTE: interop issue: agentset not ISeqable (must use
;;       existing topology in-radius)
(defn in-radius [x y agents radius distance]
  (filter #(<= (distance x y) radius) agents))

;; random cors

(defn random-cor [mn mx]
  (-> mn (- 0.5) (+ (* (.nextDouble shim.random) (+ (- mx mn) 1)))))
