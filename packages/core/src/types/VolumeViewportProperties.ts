import { VOIRange } from './voi';
import VOILUTFunctionType from '../enums/VOILUTFunctionType';

/**
 * Stack Viewport Properties
 */
type VolumeViewportProperties = {
  /** voi range (upper, lower) for the viewport */
  voiRange?: VOIRange;
  /** voiFunction type which is LINEAR, EXACT_LINEAR, or SIGMOID */
  voiFunction?: VOILUTFunctionType;
};

export default VolumeViewportProperties;
