import { VRMHumanoid, VRMLookAt, VRMLookAtApplier } from "@pixiv/three-vrm";
import * as THREE from "three";

/** Minimum interval before saccade occurs */
const SACCADE_MIN_INTERVAL = 0.5;

/**
 * Probability of saccade occurring
 */
const SACCADE_PROC = 0.05;

/** Saccade range radius. The value passed to lookAt, not the actual eyeball movement radius, so make it slightly larger. in degrees */
const SACCADE_RADIUS = 5.0;

const _v3A = new THREE.Vector3();
const _quatA = new THREE.Quaternion();
const _eulerA = new THREE.Euler();

/**
 * Add the following features to `VRMLookAt`:
 *
 * - If `userTarget` is assigned, smoothly look toward the user direction
 * - Look using not only eyes but also head rotation
 * - Add eye saccade movement
 */
export class VRMLookAtSmoother extends VRMLookAt {
  /** Coefficient for smoothing */
  public smoothFactor = 4.0;

  /** Maximum angle to look toward user in degrees */
  public userLimitAngle = 90.0;

  /** Direction toward user. The existing `target` is used for animation */
  public userTarget?: THREE.Object3D | null;

  /** Set to `false` to disable saccade */
  public enableSaccade: boolean;

  /** Store saccade movement direction */
  private _saccadeYaw = 0.0;

  /** Store saccade movement direction */
  private _saccadePitch = 0.0;

  /** When this timer exceeds SACCADE_MIN_INTERVAL, trigger saccade with SACCADE_PROC probability */
  private _saccadeTimer = 0.0;

  /** Yaw to smooth */
  private _yawDamped = 0.0;

  /** Pitch to smooth */
  private _pitchDamped = 0.0;

  /** Temporarily store firstPersonBone rotation */
  private _tempFirstPersonBoneQuat = new THREE.Quaternion();

  public constructor(humanoid: VRMHumanoid, applier: VRMLookAtApplier) {
    super(humanoid, applier);

    this.enableSaccade = true;
  }

public update(delta: number): void {
    if (this.target && this.autoUpdate) {
      // Animation gaze
      // Update `_yaw` and `_pitch`
      this.lookAt(this.target.getWorldPosition(_v3A));

      // Yaw / pitch specified by animation. Invariant within this function
      const yawAnimation = this._yaw;
      const pitchAnimation = this._pitch;

      // Yaw / pitch to be used ultimately in this frame
      let yawFrame = yawAnimation;
      let pitchFrame = pitchAnimation;

      // User direction
      if (this.userTarget) {
        // Update `_yaw` and `_pitch`
        this.lookAt(this.userTarget.getWorldPosition(_v3A));

        // Angle limitation. If exceeds `userLimitAngle`, look in direction specified by animation
        if (
          this.userLimitAngle < Math.abs(this._yaw) ||
          this.userLimitAngle < Math.abs(this._pitch)
        ) {
          this._yaw = yawAnimation;
          this._pitch = pitchAnimation;
        }

        // Smooth yawDamped / pitchDamped
        const k = 1.0 - Math.exp(-this.smoothFactor * delta);
        this._yawDamped += (this._yaw - this._yawDamped) * k;
        this._pitchDamped += (this._pitch - this._pitchDamped) * k;

        // Blend with animation
        // If animation is looking sideways, respect that direction
        const userRatio =
          1.0 -
          THREE.MathUtils.smoothstep(
            Math.sqrt(
              yawAnimation * yawAnimation + pitchAnimation * pitchAnimation
            ),
            30.0,
            90.0
          );

        // Assign result to yawFrame / pitchFrame
        yawFrame = THREE.MathUtils.lerp(
          yawAnimation,
          0.6 * this._yawDamped,
          userRatio
        );
        pitchFrame = THREE.MathUtils.lerp(
          pitchAnimation,
          0.6 * this._pitchDamped,
          userRatio
        );

        // Also rotate head
        _eulerA.set(
          -this._pitchDamped * THREE.MathUtils.DEG2RAD,
          this._yawDamped * THREE.MathUtils.DEG2RAD,
          0.0,
          VRMLookAt.EULER_ORDER
        );
        _quatA.setFromEuler(_eulerA);

        const head = this.humanoid.getRawBoneNode("head")!;
        this._tempFirstPersonBoneQuat.copy(head.quaternion);
        head.quaternion.slerp(_quatA, 0.4);
        head.updateMatrixWorld();
      }

      if (this.enableSaccade) {
        // Calculate saccade movement direction
        if (
          SACCADE_MIN_INTERVAL < this._saccadeTimer &&
          Math.random() < SACCADE_PROC
        ) {
          this._saccadeYaw = (2.0 * Math.random() - 1.0) * SACCADE_RADIUS;
          this._saccadePitch = (2.0 * Math.random() - 1.0) * SACCADE_RADIUS;
          this._saccadeTimer = 0.0;
        }

        this._saccadeTimer += delta;

        // Add saccade movement
        yawFrame += this._saccadeYaw;
        pitchFrame += this._saccadePitch;

        // Pass to applier
        this.applier.applyYawPitch(yawFrame, pitchFrame);
      }

      // Apply is already done, no need to update within this frame
      this._needsUpdate = false;
    }

    // When not controlling lookAt with target
    if (this._needsUpdate) {
      this._needsUpdate = false;
      this.applier.applyYawPitch(this._yaw, this._pitch);
    }
  }

  /** Call after render to revert head rotation */
  public revertFirstPersonBoneQuat(): void {
    if (this.userTarget) {
      const head = this.humanoid.getNormalizedBoneNode("head")!;
      head.quaternion.copy(this._tempFirstPersonBoneQuat);
    }
  }
}
