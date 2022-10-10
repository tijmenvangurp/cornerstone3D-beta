import { VOIRange } from './voi';
import VOILUTFunctionType from '../enums/VOILUTFunctionType';

/**
 * Stack Viewport Properties
 */
type VolumeViewportProperties = {
  /** voi range (upper, lower) for the viewport */
  voiRange?: VOIRange;
  /** voiLutFunction type which is LINEAR, EXACT_LINEAR, or SIGMOID */
  voiLutFunction?: VOILUTFunctionType;
};

export default VolumeViewportProperties;
