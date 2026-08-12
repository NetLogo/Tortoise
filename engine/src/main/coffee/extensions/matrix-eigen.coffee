# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('shim/strictmath')

# A transliteration of Jama 1.0.3's `EigenvalueDecomposition` (public domain, `gov.nist.math:jama:1.0.3`),
# which is what the desktop matrix extension's eigen primitives call into.  It is transliterated rather than
# reimplemented so that NetLogo Web reproduces desktop's results bit-for-bit -- `vectorious`'s own `eig` is
# symmetric-only, reports no imaginary parts, and does not terminate on a general matrix.  Loop structure and
# variable names track the Java source as closely as CoffeeScript allows so the two stay diffable; `dim` below
# is Jama's `n` field, which its `hqr2` shadows with a local `n`, as we do here too. -Jeremy B August 2026

# (Number) => Array[Number]
zeros = (n) -> (0 for _ in [0...n])

# (Number) => Array[Array[Number]]
zeros2D = (n) -> (zeros(n) for _ in [0...n])

# sqrt(a^2 + b^2) without under/overflow -- Jama's `Maths.hypot`
# (Number, Number) => Number
hypot = (a, b) ->
  if StrictMath.abs(a) > StrictMath.abs(b)
    r = b / a
    StrictMath.abs(a) * StrictMath.sqrt(1 + r * r)
  else if b isnt 0
    r = a / b
    StrictMath.abs(b) * StrictMath.sqrt(1 + r * r)
  else
    0

# Array[Array[Number]] => { realEigenvalues: Array[Number], imagEigenvalues: Array[Number], v: Array[Array[Number]] }
decompose = (A) ->

  dim = A[0].length
  V   = zeros2D(dim)
  d   = zeros(dim)
  e   = zeros(dim)
  H   = null
  ort = null

  # Symmetric Householder reduction to tridiagonal form.
  tred2 = ->

    d[j] = V[dim - 1][j] for j in [0...dim]

    # Householder reduction to tridiagonal form.

    i = dim - 1
    while i > 0

      # Scale to avoid under/overflow.

      scale = 0
      h     = 0
      for k in [0...i]
        scale = scale + StrictMath.abs(d[k])

      if scale is 0
        e[i] = d[i - 1]
        for j in [0...i]
          d[j]    = V[i - 1][j]
          V[i][j] = 0
          V[j][i] = 0
      else

        # Generate Householder vector.

        for k in [0...i]
          d[k] /= scale
          h    += d[k] * d[k]

        f = d[i - 1]
        g = StrictMath.sqrt(h)
        g = -g if f > 0

        e[i]     = scale * g
        h        = h - f * g
        d[i - 1] = f - g
        e[j]     = 0 for j in [0...i]

        # Apply similarity transformation to remaining columns.

        for j in [0...i]
          f       = d[j]
          V[j][i] = f
          g       = e[j] + V[j][j] * f
          k       = j + 1
          while k <= i - 1
            g    += V[k][j] * d[k]
            e[k] += V[k][j] * f
            k++
          e[j] = g

        f = 0
        for j in [0...i]
          e[j] /= h
          f    += e[j] * d[j]

        hh = f / (h + h)
        e[j] -= hh * d[j] for j in [0...i]

        for j in [0...i]
          f = d[j]
          g = e[j]
          k = j
          while k <= i - 1
            V[k][j] -= (f * e[k] + g * d[k])
            k++
          d[j]    = V[i - 1][j]
          V[i][j] = 0

      d[i] = h
      i--

    # Accumulate transformations.

    for i in [0...(dim - 1)]
      V[dim - 1][i] = V[i][i]
      V[i][i]       = 1
      h             = d[i + 1]
      if h isnt 0
        d[k] = V[k][i + 1] / h for k in [0..i]
        for j in [0..i]
          g = 0
          g += V[k][i + 1] * V[k][j] for k in [0..i]
          V[k][j] -= g * d[k] for k in [0..i]
      V[k][i + 1] = 0 for k in [0..i]

    for j in [0...dim]
      d[j]          = V[dim - 1][j]
      V[dim - 1][j] = 0

    V[dim - 1][dim - 1] = 1
    e[0]                = 0

    return

  # Symmetric tridiagonal QL algorithm.
  tql2 = ->

    e[i - 1] = e[i] for i in [1...dim]
    e[dim - 1] = 0

    f    = 0
    tst1 = 0
    eps  = StrictMath.pow(2, -52)

    for l in [0...dim]

      # Find small subdiagonal element

      tst1 = StrictMath.max(tst1, StrictMath.abs(d[l]) + StrictMath.abs(e[l]))
      m    = l
      while m < dim
        break if StrictMath.abs(e[m]) <= eps * tst1
        m++

      # If m == l, d[l] is an eigenvalue, otherwise, iterate.

      if m > l
        loop

          # Compute implicit shift

          g = d[l]
          p = (d[l + 1] - g) / (2 * e[l])
          r = hypot(p, 1)
          r = -r if p < 0

          d[l]     = e[l] / (p + r)
          d[l + 1] = e[l] * (p + r)
          dl1      = d[l + 1]
          h        = g - d[l]
          d[i]    -= h for i in [(l + 2)...dim]
          f        = f + h

          # Implicit QL transformation.

          p   = d[m]
          c   = 1
          c2  = c
          c3  = c
          el1 = e[l + 1]
          s   = 0
          s2  = 0

          i = m - 1
          while i >= l
            c3       = c2
            c2       = c
            s2       = s
            g        = c * e[i]
            h        = c * p
            r        = hypot(p, e[i])
            e[i + 1] = s * r
            s        = e[i] / r
            c        = p / r
            p        = c * d[i] - s * g
            d[i + 1] = h + s * (c * g + s * d[i])

            # Accumulate transformation.

            for k in [0...dim]
              h           = V[k][i + 1]
              V[k][i + 1] = s * V[k][i] + c * h
              V[k][i]     = c * V[k][i] - s * h

            i--

          p    = -s * s2 * c3 * el1 * e[l] / dl1
          e[l] = s * p
          d[l] = c * p

          # Check for convergence.

          break unless StrictMath.abs(e[l]) > eps * tst1

      d[l] = d[l] + f
      e[l] = 0

    # Sort eigenvalues and corresponding vectors.

    for i in [0...(dim - 1)]
      k = i
      p = d[i]
      for j in [(i + 1)...dim]
        if d[j] < p
          k = j
          p = d[j]
      if k isnt i
        d[k] = d[i]
        d[i] = p
        for j in [0...dim]
          p       = V[j][i]
          V[j][i] = V[j][k]
          V[j][k] = p

    return

  # Nonsymmetric reduction to Hessenberg form.
  orthes = ->

    low  = 0
    high = dim - 1

    m = low + 1
    while m <= high - 1

      # Scale column.

      scale = 0
      for i in [m..high]
        scale = scale + StrictMath.abs(H[i][m - 1])

      if scale isnt 0

        # Compute Householder transformation.

        h = 0
        i = high
        while i >= m
          ort[i] = H[i][m - 1] / scale
          h     += ort[i] * ort[i]
          i--

        g      = StrictMath.sqrt(h)
        g      = -g if ort[m] > 0
        h      = h - ort[m] * g
        ort[m] = ort[m] - g

        # Apply Householder similarity transformation
        # H = (I-u*u'/h)*H*(I-u*u')/h)

        for j in [m...dim]
          f = 0
          i = high
          while i >= m
            f += ort[i] * H[i][j]
            i--
          f = f / h
          H[i][j] -= f * ort[i] for i in [m..high]

        for i in [0..high]
          f = 0
          j = high
          while j >= m
            f += ort[j] * H[i][j]
            j--
          f = f / h
          H[i][j] -= f * ort[j] for j in [m..high]

        ort[m]       = scale * ort[m]
        H[m][m - 1]  = scale * g

      m++

    # Accumulate transformations (Algol's ortran).

    for i in [0...dim]
      for j in [0...dim]
        V[i][j] = (if i is j then 1 else 0)

    m = high - 1
    while m >= low + 1
      if H[m][m - 1] isnt 0
        ort[i] = H[i][m - 1] for i in [(m + 1)..high]
        for j in [m..high]
          g = 0
          g += ort[i] * V[i][j] for i in [m..high]
          # Double division avoids possible underflow
          g = (g / ort[m]) / H[m][m - 1]
          V[i][j] += g * ort[i] for i in [m..high]
      m--

    return

  # Complex scalar division.
  cdivr = 0
  cdivi = 0
  cdiv = (xr, xi, yr, yi) ->
    if StrictMath.abs(yr) > StrictMath.abs(yi)
      r     = yi / yr
      dd    = yr + r * yi
      cdivr = (xr + r * xi) / dd
      cdivi = (xi - r * xr) / dd
    else
      r     = yr / yi
      dd    = yi + r * yr
      cdivr = (r * xr + xi) / dd
      cdivi = (r * xi - xr) / dd
    return

  # Nonsymmetric reduction from Hessenberg to real Schur form.
  hqr2 = ->

    # Initialize

    nn      = dim
    n       = nn - 1
    low     = 0
    high    = nn - 1
    eps     = StrictMath.pow(2, -52)
    exshift = 0
    p = q = r = s = z = 0
    t = w = x = y = 0

    # Store roots isolated by balanc and compute matrix norm

    norm = 0
    for i in [0...nn]
      if i < low or i > high
        d[i] = H[i][i]
        e[i] = 0
      for j in [StrictMath.max(i - 1, 0)...nn]
        norm = norm + StrictMath.abs(H[i][j])

    # Outer loop over eigenvalue index

    iter = 0
    while n >= low

      # Look for single small sub-diagonal element

      l = n
      while l > low
        s = StrictMath.abs(H[l - 1][l - 1]) + StrictMath.abs(H[l][l])
        s = norm if s is 0
        break if StrictMath.abs(H[l][l - 1]) < eps * s
        l--

      # Check for convergence
      # One root found

      if l is n
        H[n][n] = H[n][n] + exshift
        d[n]    = H[n][n]
        e[n]    = 0
        n--
        iter = 0

      # Two roots found

      else if l is n - 1
        w               = H[n][n - 1] * H[n - 1][n]
        p               = (H[n - 1][n - 1] - H[n][n]) / 2
        q               = p * p + w
        z               = StrictMath.sqrt(StrictMath.abs(q))
        H[n][n]         = H[n][n] + exshift
        H[n - 1][n - 1] = H[n - 1][n - 1] + exshift
        x               = H[n][n]

        # Real pair

        if q >= 0
          z = (if p >= 0 then p + z else p - z)

          d[n - 1] = x + z
          d[n]     = d[n - 1]
          d[n]     = x - w / z if z isnt 0
          e[n - 1] = 0
          e[n]     = 0
          x        = H[n][n - 1]
          s        = StrictMath.abs(x) + StrictMath.abs(z)
          p        = x / s
          q        = z / s
          r        = StrictMath.sqrt(p * p + q * q)
          p        = p / r
          q        = q / r

          # Row modification

          for j in [(n - 1)...nn]
            z           = H[n - 1][j]
            H[n - 1][j] = q * z + p * H[n][j]
            H[n][j]     = q * H[n][j] - p * z

          # Column modification

          for i in [0..n]
            z           = H[i][n - 1]
            H[i][n - 1] = q * z + p * H[i][n]
            H[i][n]     = q * H[i][n] - p * z

          # Accumulate transformations

          for i in [low..high]
            z           = V[i][n - 1]
            V[i][n - 1] = q * z + p * V[i][n]
            V[i][n]     = q * V[i][n] - p * z

        # Complex pair

        else
          d[n - 1] = x + p
          d[n]     = x + p
          e[n - 1] = z
          e[n]     = -z

        n    = n - 2
        iter = 0

      # No convergence yet

      else

        # Form shift

        x = H[n][n]
        y = 0
        w = 0
        if l < n
          y = H[n - 1][n - 1]
          w = H[n][n - 1] * H[n - 1][n]

        # Wilkinson's original ad hoc shift

        if iter is 10
          exshift += x
          H[i][i] -= x for i in [low..n]
          s = StrictMath.abs(H[n][n - 1]) + StrictMath.abs(H[n - 1][n - 2])
          x = y = 0.75 * s
          w = -0.4375 * s * s

        # MATLAB's new ad hoc shift

        if iter is 30
          s = (y - x) / 2
          s = s * s + w
          if s > 0
            s = StrictMath.sqrt(s)
            s = -s if y < x
            s = x - w / ((y - x) / 2 + s)
            H[i][i] -= s for i in [low..n]
            exshift += s
            x = y = w = 0.964

        iter = iter + 1

        # Look for two consecutive small sub-diagonal elements

        m = n - 2
        while m >= l
          z = H[m][m]
          r = x - z
          s = y - z
          p = (r * s - w) / H[m + 1][m] + H[m][m + 1]
          q = H[m + 1][m + 1] - z - r - s
          r = H[m + 2][m + 1]
          s = StrictMath.abs(p) + StrictMath.abs(q) + StrictMath.abs(r)
          p = p / s
          q = q / s
          r = r / s
          break if m is l
          break if StrictMath.abs(H[m][m - 1]) * (StrictMath.abs(q) + StrictMath.abs(r)) <
            eps * (StrictMath.abs(p) * (StrictMath.abs(H[m - 1][m - 1]) + StrictMath.abs(z) +
            StrictMath.abs(H[m + 1][m + 1])))
          m--

        for i in [(m + 2)..n]
          H[i][i - 2] = 0
          H[i][i - 3] = 0 if i > m + 2

        # Double QR step involving rows l:n and columns m:n

        k = m
        while k <= n - 1
          notlast = (k isnt n - 1)
          skip    = false
          if k isnt m
            p = H[k][k - 1]
            q = H[k + 1][k - 1]
            r = (if notlast then H[k + 2][k - 1] else 0)
            x = StrictMath.abs(p) + StrictMath.abs(q) + StrictMath.abs(r)
            if x is 0
              skip = true
            else
              p = p / x
              q = q / x
              r = r / x

          if not skip
            s = StrictMath.sqrt(p * p + q * q + r * r)
            s = -s if p < 0
            if s isnt 0
              if k isnt m
                H[k][k - 1] = -s * x
              else if l isnt m
                H[k][k - 1] = -H[k][k - 1]

              p = p + s
              x = p / s
              y = q / s
              z = r / s
              q = q / p
              r = r / p

              # Row modification

              for j in [k...nn]
                p = H[k][j] + q * H[k + 1][j]
                if notlast
                  p           = p + r * H[k + 2][j]
                  H[k + 2][j] = H[k + 2][j] - p * z
                H[k][j]     = H[k][j] - p * x
                H[k + 1][j] = H[k + 1][j] - p * y

              # Column modification

              for i in [0..StrictMath.min(n, k + 3)]
                p = x * H[i][k] + y * H[i][k + 1]
                if notlast
                  p           = p + z * H[i][k + 2]
                  H[i][k + 2] = H[i][k + 2] - p * r
                H[i][k]     = H[i][k] - p
                H[i][k + 1] = H[i][k + 1] - p * q

              # Accumulate transformations

              for i in [low..high]
                p = x * V[i][k] + y * V[i][k + 1]
                if notlast
                  p           = p + z * V[i][k + 2]
                  V[i][k + 2] = V[i][k + 2] - p * r
                V[i][k]     = V[i][k] - p
                V[i][k + 1] = V[i][k + 1] - p * q

          k++

    # Backsubstitute to find vectors of upper triangular form

    return if norm is 0

    n = nn - 1
    while n >= 0
      p = d[n]
      q = e[n]

      # Real vector

      if q is 0
        l       = n
        H[n][n] = 1
        i       = n - 1
        while i >= 0
          w = H[i][i] - p
          r = 0
          for j in [l..n]
            r = r + H[i][j] * H[j][n]

          if e[i] < 0
            z = w
            s = r
          else
            l = i
            if e[i] is 0
              if w isnt 0
                H[i][n] = -r / w
              else
                H[i][n] = -r / (eps * norm)

            # Solve real equations

            else
              x           = H[i][i + 1]
              y           = H[i + 1][i]
              q           = (d[i] - p) * (d[i] - p) + e[i] * e[i]
              t           = (x * s - z * r) / q
              H[i][n]     = t
              H[i + 1][n] =
                if StrictMath.abs(x) > StrictMath.abs(z)
                  (-r - w * t) / x
                else
                  (-s - y * t) / z

            # Overflow control

            t = StrictMath.abs(H[i][n])
            if (eps * t) * t > 1
              H[j][n] = H[j][n] / t for j in [i..n]

          i--

      # Complex vector

      else if q < 0
        l = n - 1

        # Last vector component imaginary so matrix is triangular

        if StrictMath.abs(H[n][n - 1]) > StrictMath.abs(H[n - 1][n])
          H[n - 1][n - 1] = q / H[n][n - 1]
          H[n - 1][n]     = -(H[n][n] - p) / H[n][n - 1]
        else
          cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q)
          H[n - 1][n - 1] = cdivr
          H[n - 1][n]     = cdivi

        H[n][n - 1] = 0
        H[n][n]     = 1

        i = n - 2
        while i >= 0
          ra = 0
          sa = 0
          for j in [l..n]
            ra = ra + H[i][j] * H[j][n - 1]
            sa = sa + H[i][j] * H[j][n]

          w = H[i][i] - p

          if e[i] < 0
            z = w
            r = ra
            s = sa
          else
            l = i
            if e[i] is 0
              cdiv(-ra, -sa, w, q)
              H[i][n - 1] = cdivr
              H[i][n]     = cdivi
            else

              # Solve complex equations

              x  = H[i][i + 1]
              y  = H[i + 1][i]
              vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q
              vi = (d[i] - p) * 2 * q
              if vr is 0 and vi is 0
                vr = eps * norm * (StrictMath.abs(w) + StrictMath.abs(q) +
                  StrictMath.abs(x) + StrictMath.abs(y) + StrictMath.abs(z))

              cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi)
              H[i][n - 1] = cdivr
              H[i][n]     = cdivi

              if StrictMath.abs(x) > (StrictMath.abs(z) + StrictMath.abs(q))
                H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x
                H[i + 1][n]     = (-sa - w * H[i][n] - q * H[i][n - 1]) / x
              else
                cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q)
                H[i + 1][n - 1] = cdivr
                H[i + 1][n]     = cdivi

            # Overflow control

            t = StrictMath.max(StrictMath.abs(H[i][n - 1]), StrictMath.abs(H[i][n]))
            if (eps * t) * t > 1
              for j in [i..n]
                H[j][n - 1] = H[j][n - 1] / t
                H[j][n]     = H[j][n] / t

          i--

      n--

    # Vectors of isolated roots

    for i in [0...nn]
      if i < low or i > high
        V[i][j] = H[i][j] for j in [i...nn]

    # Back transformation to get eigenvectors of original matrix

    j = nn - 1
    while j >= low
      for i in [low..high]
        z = 0
        for k in [low..StrictMath.min(j, high)]
          z = z + V[i][k] * H[k][j]
        V[i][j] = z
      j--

    return

  # Check for symmetry, then construct the eigenvalue decomposition.

  issymmetric = true
  j = 0
  while j < dim and issymmetric
    i = 0
    while i < dim and issymmetric
      issymmetric = (A[i][j] is A[j][i])
      i++
    j++

  if issymmetric
    for i in [0...dim]
      V[i][j] = A[i][j] for j in [0...dim]

    # Tridiagonalize.
    tred2()

    # Diagonalize.
    tql2()

  else
    H   = zeros2D(dim)
    ort = zeros(dim)

    for j in [0...dim]
      H[i][j] = A[i][j] for i in [0...dim]

    # Reduce to Hessenberg form.
    orthes()

    # Reduce Hessenberg to real Schur form.
    hqr2()

  { realEigenvalues: d, imagEigenvalues: e, v: V }

module.exports = { decompose }
