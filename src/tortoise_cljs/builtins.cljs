(ns engine.core.structure.builtins) ;; replace builtlins

(def turtles [:id :color :heading :xcor :ycor :shape :label
              :label-color :breed :hidden? :size :pen-size
              :pen-mode])

(def patches [:pxcor :pycor :pcolor :plabel :plabel-color])

(def links [:end1 :end2 :lcolor :llabel :llabelcolor :lhidden
            :lbreed :thickness :lshape :tie-mode])

;; NOTE: this are fns on link; kept here for reference
;; renderer expects these; might have to add them to an adapter
;; if we even get to that point (7/18/2014)
(def links-extra [:color :heading :shape :label :label-color :breed
                  :hidden? :size :midpointx :midpointy])

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Aliases                                                       ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(ns Builtins
  (:use [engine.core.structure.builtins :only [turtles patches links links-extra]]))

(def turtleBuiltins (clj->js engine.core.structure.builtins/turtles))
(def patchBuiltins  (clj->js engine.core.structure.builtins/patches))
(def linkBuiltins     (clj->js engine.core.structure.builtins/links))
(def linkExtras (clj->js engine.core.structure.builtins/links-extra))
