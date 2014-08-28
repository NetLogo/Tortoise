(ns agents.turtle)

;; Components and pieces -- JTT (8/26/14)
;;
;; self-variables
;; - breed
;; - shape
;; - color
;; - all the other stuff in builtins
;; links
;; current-patch
;; coordinates
;; patch-math
;; - towards (agent)
;; - towards-xy
;; - faceXY
;; - face (agent)
;; - in-radius
;; - get-patch
;; - patch ahead
;; - patch right and ahead
;; - patch left and ahead
;; - get-neighbors-4
;; - get-neighbors
;; movement
;; - fd
;; - "jump" (go x distance in current direction)
;; - right (turn right)
;; - set location (go to x, y)
;; - move to (another agent's location)
;; patch interaction
;; - cohabitating turtles
;; ask-able
;; can die
;; can be hidden
;; hatch new turtle(s)
;; watch-able
;; link interaction
;; - link-neighbors
;; - directed and undirected linksets
;; - link removal
;;

;; SCAFFOLDING -- JTT (8/26/14)
(def turtle-defaults
  {:breed       nil ;; "world.breedManager.turtles()" is the exact default -- JTT (8/26/14)
   :shape       nil
   :color       0.0
   :size        1.0
   :heading     0.0
   :label       ""
   :label-color 9.9
   :hidden      false})

(defn turtle
  ([x y]
    (entity* :turtle
             :defaults turtle-defaults
             :init [(indexed)
                    (self-vars :turtle)
                    (coordinates x y)
                    (life)
                    (distance-finders)
                    (towards)
                    (face)
                    (spliced-in-radius)
                    (patch-getter)
                    (movement)
                    (patches-ahead)
                    (ask)
                    (watch)
                    (links)]))
  ([]
   (turtle 0 0)))
