// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.engine

import
  java.{ io, util },
    io.Serializable,
    util.Random

import
  scala.scalajs.js.annotation.{ JSExport, JSExportTopLevel }

// scalastyle:off
// MT home page has moved to
//   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
/**
 * <h3>MersenneTwister and MersenneTwisterFast</h3>
 * <p><b>Version 9</b>, based on version MT199937(99/10/29)
 * of the Mersenne Twister algorithm found at
 * <a href="http://www.math.keio.ac.jp/matumoto/emt.html">
 * The Mersenne Twister Home Page</a>, with the initialization
 * improved using the new 2002/1/26 initialization algorithm
 * By Sean Luke, October 2004.
 * <p/>
 * <p><b>MersenneTwister</b> is a drop-in subclass replacement
 * for java.util.Random.  It is properly synchronized and
 * can be used in a multithreaded environment.  On modern VMs such
 * as HotSpot, it is approximately 1/3 slower than java.util.Random.
 * <p/>
 * <p><b>MersenneTwisterFast</b> is not a subclass of java.util.Random.  It has
 * the same public methods as Random does, however, and it is
 * algorithmically identical to MersenneTwister.  MersenneTwisterFast
 * has hard-code inlined all of its methods directly, and made all of them
 * final (well, the ones of consequence anyway).  Further, these
 * methods are <i>not</i> synchronized, so the same MersenneTwisterFast
 * instance cannot be shared by multiple threads.  But all this helps
 * MersenneTwisterFast achieve well over twice the speed of MersenneTwister.
 * java.util.Random is about 1/3 slower than MersenneTwisterFast.
 * <p/>
 * <h3>About the Mersenne Twister</h3>
 * <p>This is a Java version of the C-program for MT19937: Integer version.
 * The MT19937 algorithm was created by Makoto Matsumoto and Takuji Nishimura,
 * who ask: "When you use this, send an email to: matumoto@math.keio.ac.jp
 * with an appropriate reference to your work".  Indicate that this
 * is a translation of their algorithm into Java.
 * <p/>
 * <p><b>Reference. </b>
 * Makato Matsumoto and Takuji Nishimura,
 * "Mersenne Twister: A 623-Dimensionally Equidistributed Uniform
 * Pseudo-Random Number Generator",
 * <i>ACM Transactions on Modeling and Computer Simulation,</i>
 * Vol. 8, No. 1, January 1998, pp 3--30.
 * <p/>
 * <h3>About this Version</h3>
 * <p/>
 * <p><b>Changes Since V8:</b> setSeed(int) was only using the first 28 bits
 * of the seed; it should have been 32 bits.  For small-number seeds the
 * behavior is identical.
 * <p/>
 * <p><b>Changes Since V7:</b> A documentation error in MersenneTwisterFast
 * (but not MersenneTwister) stated that nextDouble selects uniformly from
 * the full-open interval [0,1].  It does not.  nextDouble's contract is
 * identical across MersenneTwisterFast, MersenneTwister, and java.util.Random,
 * namely, selection in the half-open interval [0,1).  That is, 1.0 should
 * not be returned.  A similar contract exists in nextFloat.
 * <p/>
 * <p><b>Changes Since V6:</b> License has changed from LGPL to BSD.
 * New timing information to compare against
 * java.util.Random.  Recent versions of HotSpot have helped Random increase
 * in speed to the point where it is faster than MersenneTwister but slower
 * than MersenneTwisterFast (which should be the case, as it's a less complex
 * algorithm but is synchronized).
 * <p/>
 * <p><b>Changes Since V5:</b> New empty constructor made to work the same
 * as java.util.Random -- namely, it seeds based on the current time in
 * milliseconds.
 * <p/>
 * <p><b>Changes Since V4:</b> New initialization algorithms.  See
 * (see <a href="http://www.math.keio.ac.jp/matumoto/MT2002/emt19937ar.html"</a>
 * http://www.math.keio.ac.jp/matumoto/MT2002/emt19937ar.html</a>)
 * <p/>
 * <p>The MersenneTwister code is based on standard MT19937 C/C++
 * code by Takuji Nishimura,
 * with suggestions from Topher Cooper and Marc Rieffel, July 1997.
 * The code was originally translated into Java by Michael Lecuyer,
 * January 1999, and the original code is Copyright (c) 1999 by Michael Lecuyer.
 * <p/>
 * <h3>Java notes</h3>
 * <p/>
 * <p>This implementation implements the bug fixes made
 * in Java 1.2's version of Random, which means it can be used with
 * earlier versions of Java.  See
 * <a href="http://www.javasoft.com/products/jdk/1.2/docs/api/java/util/Random.html">
 * the JDK 1.2 java.util.Random documentation</a> for further documentation
 * on the random-number generation contracts made.  Additionally, there's
 * an undocumented bug in the JDK java.util.Random.nextBytes() method,
 * which this code fixes.
 * <p/>
 * <p> Just like java.util.Random, this
 * generator accepts a long seed but doesn't use all of it.  java.util.Random
 * uses 48 bits.  The Mersenne Twister instead uses 32 bits (int size).
 * So it's best if your seed does not exceed the int range.
 * <p/>
 * <p>MersenneTwister can be used reliably
 * on JDK version 1.1.5 or above.  Earlier Java versions have serious bugs in
 * java.util.Random; only MersenneTwisterFast (and not MersenneTwister nor
 * java.util.Random) should be used with them.
 * <p/>
 * <h3>License</h3>
 * <p/>
 * Copyright (c) 2003 by Sean Luke. <br>
 * Portions copyright (c) 1993 by Michael Lecuyer. <br>
 * All rights reserved. <br>
 * <p/>
 * <p>Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li> Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * <li> Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * <li> Neither the name of the copyright owners, their employers, nor the
 * names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 * </ul>
 * <p>THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNERS OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @version 8
 */
object MersenneTwisterFast {
  private val N: Int = 624
  private val M: Int = 397
  private val MATRIX_A: Int = 0x9908b0df
  private val UPPER_MASK: Int = 0x80000000
  private val LOWER_MASK: Int = 0x7fffffff
  private val TEMPERING_MASK_B: Int = 0x9d2c5680
  private val TEMPERING_MASK_C: Int = 0xefc60000
  private val IDENTIFIER: String = "0"
}


/**
 * Constructor using a given seed.  Though you pass this seed in
 * as a long, it's best to make sure it's actually an integer.
 */
@JSExportTopLevel("MersenneTwisterFast")
final class MersenneTwisterFast(seed: Long = System.nanoTime) extends Random with Serializable with Cloneable {

  private var __mt: Array[Int] = null
  private var mti: Int = 0
  private var __mag01: Array[Int] = null
  private var __nextNextGaussian: Double = 0.0
  private var __haveNextNextGaussian: Boolean = false

  setSeed(seed)

  /**
   * This method added for use by NetLogo's "with-local-randomness"
   * primitive.  It was not in Sean's original code.
   */
  // Modified from the original JVM source code.
  // I changed it because `super.clone` simply threw
  // exceptions in the browser. --JAB (9/23/15)
  @JSExport
  override def clone: MersenneTwisterFast = {
    val result = new MersenneTwisterFast(seed)
    result.__mt                   = __mt.clone
    result.mti                    = mti
    result.__mag01                = __mag01.clone
    result.__nextNextGaussian     = __nextNextGaussian
    result.__haveNextNextGaussian = __haveNextNextGaussian
    result
  }

  /**
   * This method added for use by NetLogo's export-world feature.
   * It was not in Sean's original code.
   */
  @JSExport
  def save(): String = {
    val gaussianStr = if (__nextNextGaussian == __nextNextGaussian.toInt) (__nextNextGaussian + ".0") else __nextNextGaussian
    val result: StringBuilder = new StringBuilder(MersenneTwisterFast.IDENTIFIER + " " + __mag01(0) + " " + __mag01(1) + " " + mti + " " + gaussianStr + " " + __haveNextNextGaussian)
    var i: Int = 0
    while (i < MersenneTwisterFast.N) {
      result.append(" ")
      result.append(Integer.toString(__mt(i)))
      i += 1
    }
    result.toString
  }

  /**
   * This method added for use by NetLogo's import-world feature.
   * It was not in Sean's original code.
   */
  @JSExport
  def load(s: String) {

    val tokenizer = s.split("\\s")
    val identifier: String = tokenizer(0)
    if (!(identifier == MersenneTwisterFast.IDENTIFIER)) {
      throw new RuntimeException("identifier mismatch: expected \"" + MersenneTwisterFast.IDENTIFIER + "\", got \"" + identifier + "\"")
    }

    __mag01(0) = tokenizer(1).toInt
    __mag01(1) = tokenizer(2).toInt
    mti = tokenizer(3).toInt
    __nextNextGaussian = tokenizer(4).toDouble

    val next: String = tokenizer(5)
    if (next == "true") {
      __haveNextNextGaussian = true
    }
    else if (next == "false") {
      __haveNextNextGaussian = false
    }
    else {
      throw new RuntimeException("expected true or false, got \"" + next + "\"")
    }

    var i: Int = 0
    while (i < MersenneTwisterFast.N) {
      __mt(i) = tokenizer(6 + i).toInt
      i += 1
    }

    assert(tokenizer.length <= 6 + i)

  }

  /**
   * Initalize the pseudo random number generator.  Don't
   * pass in a long that's bigger than an int (Mersenne Twister
   * only uses the first 32 bits for its seed).
   */
  @JSExport
  def setSeed(seed: Int): Unit = {
    setSeed(seed.toLong)
  }

  override def setSeed(seed: Long) {
    __haveNextNextGaussian = false
    __nextNextGaussian = 0
    __mt = new Array[Int](MersenneTwisterFast.N)
    __mag01 = new Array[Int](2)
    __mag01(0) = 0x0
    __mag01(1) = MersenneTwisterFast.MATRIX_A
    __mt(0) = (seed & 0xffffffff).toInt
    mti = 1
    while (mti < MersenneTwisterFast.N) {
      __mt(mti) = 1812433253 * (__mt(mti - 1) ^ (__mt(mti - 1) >>> 30)) + mti
      __mt(mti) &= 0xffffffff
      mti += 1
    }
  }

  @JSExport
  override def nextInt(): Int = {

    var y: Int = 0

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
      mti = 0

    }

    y = __mt({ mti += 1; mti - 1 })
    y ^= y >>> 11
    y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    y ^= (y >>> 18)

    y

  }

  override def nextBoolean: Boolean = {

    var y: Int = 0

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
      mti = 0

    }

    y = __mt({ mti += 1; mti - 1 })
    y ^= y >>> 11
    y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    y ^= (y >>> 18)

    (y >>> 31) != 0

  }

  override def nextBytes(bytes: Array[Byte]) {

    var y: Int = 0
    var x: Int = 0

    while (x < bytes.length) {

      if (mti >= MersenneTwisterFast.N) {

        var kk: Int = 0
        val mt: Array[Int] = this.__mt
        val mag01: Array[Int] = this.__mag01

        while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        while (kk < MersenneTwisterFast.N - 1) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
        mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
        mti = 0

      }

      y = __mt({ mti += 1; mti - 1 })
      y ^= y >>> 11
      y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
      y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
      y ^= (y >>> 18)
      bytes(x) = (y >>> 24).toByte

      x += 1

    }

  }

  override def nextLong: Long = {

    var y: Int = 0
    var z: Int = 0

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
      mti = 0

    }

    y = __mt({ mti += 1; mti - 1 })
    y ^= y >>> 11
    y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    y ^= (y >>> 18)

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (z >>> 1) ^ mag01(z & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (z >>> 1) ^ mag01(z & 0x1)
        kk += 1
      }

      z = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (z >>> 1) ^ mag01(z & 0x1)
      mti = 0

    }

    z = __mt({ mti += 1; mti - 1 })
    z ^= z >>> 11
    z ^= (z << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    z ^= (z << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    z ^= (z >>> 18)

    (y.toLong << 32) + z

  }

  @JSExport
  def nextLong(n: Double): Double =
    nextLongEx(n.toLong).toDouble

  /**
   * Returns a long drawn uniformly from 0 to n-1.  Suffice it to say,
   * n must be > 0, or an IllegalArgumentException is raised.
   */
  // the goofy name is because this is not a method on `Random` in Java 11, but it is a
  // method on `Random` (via `RandomGenerator`) on Java 17.  We want to support both J11
  // and J17 if we can, so we rename this.  -Jeremy B September 2022
  private def nextLongEx(n: Long): Long = {

    if (n <= 0) throw new IllegalArgumentException("n must be positive")

    var bits: Long = 0L
    var value: Long = 0L

    do {

      var y: Int = 0
      var z: Int = 0

      if (mti >= MersenneTwisterFast.N) {

        var kk: Int = 0
        val mt: Array[Int] = this.__mt
        val mag01: Array[Int] = this.__mag01

        while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        while (kk < MersenneTwisterFast.N - 1) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
        mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
        mti = 0

      }

      y = __mt({ mti += 1; mti - 1 })
      y ^= y >>> 11
      y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
      y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
      y ^= (y >>> 18)

      if (mti >= MersenneTwisterFast.N) {

        var kk: Int = 0
        val mt: Array[Int] = this.__mt
        val mag01: Array[Int] = this.__mag01

        while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
          z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (z >>> 1) ^ mag01(z & 0x1)
          kk += 1
        }

        while (kk < MersenneTwisterFast.N - 1) {
          z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (z >>> 1) ^ mag01(z & 0x1)
          kk += 1
        }

        z = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
        mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (z >>> 1) ^ mag01(z & 0x1)
        mti = 0

      }

      z = __mt({ mti += 1; mti - 1 })
      z ^= z >>> 11
      z ^= (z << 7) & MersenneTwisterFast.TEMPERING_MASK_B
      z ^= (z << 15) & MersenneTwisterFast.TEMPERING_MASK_C
      z ^= (z >>> 18)

      bits = ((y.toLong << 32) + z) >>> 1
      value = bits % n

    } while (bits - value + (n - 1) < 0)

    value

  }

  /**
   * Returns a random double in the half-open range from [0.0,1.0).  Thus 0.0 is a valid
   * result but 1.0 is not.
   */
  @JSExport
  override def nextDouble: Double = {

    var y: Int = 0
    var z: Int = 0

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
      mti = 0

    }

    y = __mt({ mti += 1; mti - 1 })
    y ^= y >>> 11
    y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    y ^= (y >>> 18)

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (z >>> 1) ^ mag01(z & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (z >>> 1) ^ mag01(z & 0x1)
        kk += 1
      }

      z = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (z >>> 1) ^ mag01(z & 0x1)
      mti = 0

    }

    z = __mt({ mti += 1; mti - 1 })
    z ^= z >>> 11
    z ^= (z << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    z ^= (z << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    z ^= (z >>> 18)

    (((y >>> 6).toLong << 27) + (z >>> 5)) / (1L << 53).toDouble

  }

  @JSExport
  override def nextGaussian: Double = {
    if (__haveNextNextGaussian) {
      __haveNextNextGaussian = false
      __nextNextGaussian
    }
    else {

      var v1: Double = .0
      var v2: Double = .0
      var s: Double = .0

      do {

        var y: Int = 0
        var z: Int = 0
        var a: Int = 0
        var b: Int = 0

        if (mti >= MersenneTwisterFast.N) {

          var kk: Int = 0
          val mt: Array[Int] = this.__mt
          val mag01: Array[Int] = this.__mag01

          while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
            y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
            kk += 1
          }

          while (kk < MersenneTwisterFast.N - 1) {
            y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
            kk += 1
          }

          y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
          mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
          mti = 0

        }

        y = __mt({ mti += 1; mti - 1 })
        y ^= y >>> 11
        y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
        y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
        y ^= (y >>> 18)

        if (mti >= MersenneTwisterFast.N) {

          var kk: Int = 0
          val mt: Array[Int] = this.__mt
          val mag01: Array[Int] = this.__mag01

          while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
            z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (z >>> 1) ^ mag01(z & 0x1)
            kk += 1
          }

          while (kk < MersenneTwisterFast.N - 1) {
            z = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (z >>> 1) ^ mag01(z & 0x1)
            kk += 1
          }

          z = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
          mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (z >>> 1) ^ mag01(z & 0x1)
          mti = 0

        }

        z = __mt({ mti += 1; mti - 1 })
        z ^= z >>> 11
        z ^= (z << 7) & MersenneTwisterFast.TEMPERING_MASK_B
        z ^= (z << 15) & MersenneTwisterFast.TEMPERING_MASK_C
        z ^= (z >>> 18)

        if (mti >= MersenneTwisterFast.N) {

          var kk: Int = 0
          val mt: Array[Int] = this.__mt
          val mag01: Array[Int] = this.__mag01

          while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
            a = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (a >>> 1) ^ mag01(a & 0x1)
            kk += 1
          }

          while (kk < MersenneTwisterFast.N - 1) {
            a = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (a >>> 1) ^ mag01(a & 0x1)
            kk += 1
          }

          a = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
          mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (a >>> 1) ^ mag01(a & 0x1)
          mti = 0

        }

        a = __mt({ mti += 1; mti - 1 })
        a ^= a >>> 11
        a ^= (a << 7) & MersenneTwisterFast.TEMPERING_MASK_B
        a ^= (a << 15) & MersenneTwisterFast.TEMPERING_MASK_C
        a ^= (a >>> 18)

        if (mti >= MersenneTwisterFast.N) {
          var kk: Int = 0
          val mt: Array[Int] = this.__mt
          val mag01: Array[Int] = this.__mag01

          kk = 0
          while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
            b = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (b >>> 1) ^ mag01(b & 0x1)
            kk += 1
          }

          while (kk < MersenneTwisterFast.N - 1) {
            b = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
            mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (b >>> 1) ^ mag01(b & 0x1)
            kk += 1
          }

          b = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
          mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (b >>> 1) ^ mag01(b & 0x1)
          mti = 0

        }

        b = __mt({ mti += 1; mti - 1 })
        b ^= b >>> 11
        b ^= (b << 7) & MersenneTwisterFast.TEMPERING_MASK_B
        b ^= (b << 15) & MersenneTwisterFast.TEMPERING_MASK_C
        b ^= (b >>> 18)

        v1 = 2 * ((((y >>> 6).toLong << 27) + (z >>> 5)) / (1L << 53).toDouble) - 1
        v2 = 2 * ((((a >>> 6).toLong << 27) + (b >>> 5)) / (1L << 53).toDouble) - 1
        s = v1 * v1 + v2 * v2

      } while (s >= 1 || s == 0)

      val multiplier: Double = MersenneMath.sqrt(-2 * MersenneMath.log(s) / s)
      __nextNextGaussian = v2 * multiplier
      __haveNextNextGaussian = true

      v1 * multiplier

    }
  }

  /**
   * Returns a random float in the half-open range from [0.0f,1.0f).  Thus 0.0f is a valid
   * result but 1.0f is not.
   */
  override def nextFloat: Float = {

    var y: Int = 0

    if (mti >= MersenneTwisterFast.N) {

      var kk: Int = 0
      val mt: Array[Int] = this.__mt
      val mag01: Array[Int] = this.__mag01

      while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      while (kk < MersenneTwisterFast.N - 1) {
        y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
        mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
        kk += 1
      }

      y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
      mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
      mti = 0

    }

    y = __mt({ mti += 1; mti - 1 })
    y ^= y >>> 11
    y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
    y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
    y ^= (y >>> 18)

    (y >>> 8) / (1 << 24).toFloat

  }

  /**
   * Returns an integer drawn uniformly from 0 to n-1.  Suffice it to say,
   * n must be > 0, or an IllegalArgumentException is raised.
   */
  @JSExport
  override def nextInt(n: Int): Int = {
    if (n <= 0) throw new IllegalArgumentException("n must be positive")
    if ((n & -n) == n) {

      var y: Int = 0

      if (mti >= MersenneTwisterFast.N) {

        var kk: Int = 0
        val mt: Array[Int] = this.__mt
        val mag01: Array[Int] = this.__mag01

        while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        while (kk < MersenneTwisterFast.N - 1) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
        mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
        mti = 0

      }

      y = __mt({ mti += 1; mti - 1 })
      y ^= y >>> 11
      y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
      y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
      y ^= (y >>> 18)

      return ((n * (y >>> 1).toLong) >> 31).toInt

    }

    var bits: Int = 0
    var value: Int = 0

    do {

      var y: Int = 0

      if (mti >= MersenneTwisterFast.N) {

        var kk: Int = 0
        val mt: Array[Int] = this.__mt
        val mag01: Array[Int] = this.__mag01

        while (kk < MersenneTwisterFast.N - MersenneTwisterFast.M) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + MersenneTwisterFast.M) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        while (kk < MersenneTwisterFast.N - 1) {
          y = (mt(kk) & MersenneTwisterFast.UPPER_MASK) | (mt(kk + 1) & MersenneTwisterFast.LOWER_MASK)
          mt(kk) = mt(kk + (MersenneTwisterFast.M - MersenneTwisterFast.N)) ^ (y >>> 1) ^ mag01(y & 0x1)
          kk += 1
        }

        y = (mt(MersenneTwisterFast.N - 1) & MersenneTwisterFast.UPPER_MASK) | (mt(0) & MersenneTwisterFast.LOWER_MASK)
        mt(MersenneTwisterFast.N - 1) = mt(MersenneTwisterFast.M - 1) ^ (y >>> 1) ^ mag01(y & 0x1)
        mti = 0

      }

      y = __mt({ mti += 1; mti - 1 })
      y ^= y >>> 11
      y ^= (y << 7) & MersenneTwisterFast.TEMPERING_MASK_B
      y ^= (y << 15) & MersenneTwisterFast.TEMPERING_MASK_C
      y ^= (y >>> 18)

      bits  = y >>> 1
      value = bits % n

    } while (bits - value + (n - 1) < 0)

    value

  }

  protected override def next(bits: Int): Int = {
    throw new UnsupportedOperationException
  }

}
// scalastyle:on
