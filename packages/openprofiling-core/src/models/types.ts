
import { Config, Reactions } from './config'
import { Exporter } from '../exporters/types'
import { Trigger } from '../triggers/types'
import { Profiler } from '../profilers/types'

export enum ProfileType {
  HEAP_PROFILE = 'HEAP_PROFILE',
  CPU_PROFILE = 'CPU_PROFILE'
}

export enum ProfileStatus {
  SUCCESS = 1,
  FAILED = 0
}

export interface ProfileListener {
  onProfileStart(profile: Profile): void;
  onProfileEnd(profile: Profile): void;
}

/** Maps a label to a string, number or boolean. */
export interface Attributes {
  [attributeKey: string]: string | number | boolean
}

/** Interface for profile */
export interface Profile {
  /** The profile ID of this profile */
  readonly id: string

  /** The resource name of the profile */
  name: string

  /** Kind of profile. */
  kind: ProfileType

  /** A final status for this profile */
  status: ProfileStatus

  /** A set of attributes, each in the format [KEY]:[VALUE] */
  attributes: Attributes

  /** The actual data that the profiler gave us */
  data: Buffer

  /** Indicates if profile was started. */
  readonly started: boolean

  /** Indicates if profile was ended. */
  readonly ended: boolean

  /**
   * Gives a timestap that indicates the profile's start time in RFC3339 UTC
   * "Zulu" format.
   */
  readonly startTime: Date

  /**
   * Gives a timestap that indicates the profile's end time in RFC3339 UTC
   * "Zulu" format.
   */
  readonly endTime: Date

  /**
   * Gives a timestap that indicates the profile's duration in RFC3339 UTC
   * "Zulu" format.
   */
  readonly duration: number

  /**
   * Adds an atribute to the profile.
   * @param key Describes the value added.
   * @param value The result of an operation.
   */
  addAttribute(key: string, value: string|number|boolean): void;

  /**
   * Adds raw data to a profile
   * @param data Buffer containing the data that will be attached to the profile
   */
  addProfileData (data: Buffer): void

  /** Ends a profile. */
  end(): void;
}

export interface Agent {
  
  /** Service to send collected profiles to. */
  readonly exporter: Exporter

  /** List of triggers that can launch a profile */
  readonly triggers: Trigger[]

  /** List of profilers */
  readonly profilers: Profiler[]

  /** List of reactions */
  readonly reactions: Reactions

  /** Gets active status  */
  active: boolean;

  /**
   * Starts agent.
   * @param userConfig A configuration object to start the agent.
   * @returns The profile agent object.
   */
  start(userConfig?: Config): Agent

  /** Stops agent. */
  stop(): void

  /**
   * Registers an exporter to send the collected traces to.
   * @param exporter The exporter to send the profiles to.
   * @returns The profile agent object.
   */
  registerExporter(exporter: Exporter): Agent

  /**
   * Unregisters an exporter.
   * @param exporter The exporter to stop sending profiles to.
   */
  unregisterExporter(exporter: Exporter): Agent
}