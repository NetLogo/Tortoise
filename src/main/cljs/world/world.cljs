(ns world
  (:require [util.etc :refer [js-err]]))

(def _id (gensym "world_"))
(def ^:dynamic inited? false)
(def ^:dynamic _topology_type :NONE)

(def ^:private _size (atom 0))
(def ^:private patchset (atom nil))

(defn size [] @_size)
(defn patches [] @patchset)

;; this is now more difficult to reason about, but it
;; matches Tortoise proper's top-left to bottom-right
;; list order. -- JTT (8/8/14)
(defn _gen_patchset [mnx mxx mny mxy]
  (with-meta (vec (for [h (reverse (range mnx (inc mxx)))
                        w (range mny (inc mxy))]
                   {:idx (swap! _size inc)
                    :x w
                    :y h
                    :variables {}
                    :get-variable #(this-as this ((keyword %) (:variables this)))}))
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
    (nth (drop (* (inc (- max-pxcor min-pxcor)) (- (- y) min-pycor)) @patchset) (- x min-pxcor))))
