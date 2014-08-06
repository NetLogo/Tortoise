(ns world
  (:require [topology.vars :refer [min-pxcor max-pxcor
                                         min-pycor max-pycor
                                         _set_bounds! terraformers]]
            [util.etc :refer [js-err]]))

(def _id (gensym "world_"))
(def ^:dynamic inited? false)
(def ^:dynamic _topology_type :NONE)

(def ^:private _size (atom 0))
(def ^:private patchset (atom nil))

(defn size [] @_size)

;; information the world needs
;;
;; patchset
;; turtleset
;; and change those things each "tick" or whatever

(defn _gen_patchset [mnx mxx mny mxy]
  (with-meta (vec (for [w (range mnx (inc mxx))
                        h (range mny (inc mxy))]
                   {:idx (swap! _size inc) :x w :y h :inhabitants (atom nil)}))
    {:SHAPE _topology_type}))

(defn init [tt mnx mxx mny mxy]
  (when (not inited?)
    (reset! _size 0)
    (_set_bounds! mnx mxx mny mxy)
    (set! _topology_type (keyword (.toUpperCase tt))) ;; must come before reset! patchset
    (reset! patchset (_gen_patchset min-pxcor max-pxcor min-pycor max-pycor))
    (((terraformers (keyword (.toUpperCase tt)))))
    (set! inited? true)))

(defn get-patch-at [x y]
  (if (not inited?)
    (js-err "World not initialized")
    (nth (drop (* (inc (- max-pycor min-pycor)) (- x min-pxcor)) @patchset) (- y min-pycor))))
