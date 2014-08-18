(ns lib.entity)

(defmacro entity [nm params & state]
  `(defn ~nm ~params
     (let [~'e (transient {})]
       (doseq [~'fs ~(get (conj {} (vec state)) :param-init)]
         (conj! ~'e (~'fs ~'e)))
     (persistent! ~'e))))

(defn entity* [nm & state]
  (let [e (transient {})]
    (doseq [bit (partition-all 2 state)]
      (conj! e (vec bit)))
    (assoc! e :name (name nm))))

(defn entity-init [e]
  (doseq [ifs (:init e)]
    (conj! e (ifs e)))
  (persistent! (dissoc! e :init)))

(defn bounds [mnx mxx mny mxy]
  (fn bounds [_]
    {:min-pxcor mnx
     :max-pxcor mxx
     :min-pycor mny
     :max-pycor mxy
     :edge-bounds {:min-pxcor (- mnx 0.5)
                   :max-pxcor (+ mxx 0.5)
                   :min-pycor (- mny 0.5)
                   :max-pycor (+ mxy 0.5)}}))

;; would like to be able to write
;; (comp bounds [blah blah...]
;;   :min-pxcor blah
;;   ... )
;; (comp edge-bounds [blah blah ...]
;;   :min-pxcor blah
;;   ... )
;;
;; and be returned the fn.
;; -- JTT (8/18/14)

(defn patch-math-wrap [p mn mx]
  ;; squash so that -5.500001 != 5.5 -- JTT (7/28/14)
  (let [pos p];;(squash-4 p mn)]
  (cond
    ;; use >= to consistently return -5.5 for the "seam" of the
    ;; wrapped shape -- i.e., -5.5 = 5.5, so consistently
    ;; report -5.5 in order to have equality checks work
    ;; correctly. -- JTT (7/23/14)
    (>= pos mx) (-> pos (- mx) (mod (- mx mn)) (+ mn))
    (< pos mn)  (- mx (-> (- mn pos)
                          (mod (- mx mn)))) ;; ((min - pos) % (max - min))
    :default pos)))

(defn wrap
  ([] (fn [e] (let [mnx (get-in e [:edge-bounds :min-pxcor])
                    mxx (get-in e [:edge-bounds :max-pxcor])
                    mny (get-in e [:edge-bounds :min-pycor])
                    mxy (get-in e [:edge-bounds :max-pycor])]
                {:wrap-x (fn [x] (patch-math-wrap x mnx mxx))
                 :wrap-y (fn [y] (patch-math-wrap y mny mxy))}))))

(defn torus [mnx mxx mny mxy]
  (entity* :torus
           :init [(bounds mnx mxx mny mxy)
                  (wrap)]))

((:wrap-x (entity-init (torus -5 5 -5 5))) 5.5)
