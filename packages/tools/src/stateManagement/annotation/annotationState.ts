import {
  getEnabledElement,
  triggerEvent,
  eventTarget,
  utilities as csUtils,
} from '@cornerstonejs/core';
import { Events } from '../../enums';
import { defaultFrameOfReferenceSpecificAnnotationManager } from './FrameOfReferenceSpecificAnnotationManager';
import { Annotations, Annotation } from '../../types/AnnotationTypes';

import {
  AnnotationAddedEventDetail,
  AnnotationRemovedEventDetail,
} from '../../types/EventTypes';

/**
 * It returns the default annotations manager.
 * @returns the singleton default annotations manager.
 */
function getDefaultAnnotationManager() {
  return defaultFrameOfReferenceSpecificAnnotationManager;
}

/**
 * Returns the annotations for the `FrameOfReference` of the `Viewport`
 * being viewed by the cornerstone3D enabled `element`.
 *
 * @param element - The HTML element.
 * @param toolName - The name of the tool.
 * @returns The annotations corresponding to the Frame of Reference and the toolName.
 */
function getAnnotations(
  element: HTMLDivElement,
  toolName: string
): Annotations {
  const enabledElement = getEnabledElement(element);
  const annotationManager = getDefaultAnnotationManager();
  const { FrameOfReferenceUID } = enabledElement;

  return annotationManager.get(FrameOfReferenceUID, toolName);
}

/**
 * Add the annotation to the annotations for the `FrameOfReference` of the `Viewport`
 * being viewed by the cornerstone3D enabled `element`.
 *
 * @param element - HTMLDivElement
 * @param annotation - The annotation that is being added to the annotations manager.
 */
function addAnnotation(annotation: Annotation): void {
  const annotationManager = getDefaultAnnotationManager();

  if (annotation.annotationUID === undefined) {
    annotation.annotationUID = csUtils.uuidv4() as string;
  }

  annotationManager.addAnnotation(annotation);

  const eventType = Events.ANNOTATION_ADDED;
  const eventDetail: AnnotationAddedEventDetail = {
    annotation,
  };

  triggerEvent(eventTarget, eventType, eventDetail);
}

/**
 * Remove the annotation by UID of the annotation.
 * @param element - HTMLDivElement
 * @param annotationUID - The unique identifier for the annotation.
 */
function removeAnnotation(annotationUID: string): void {
  const annotationManager = getDefaultAnnotationManager();

  const annotation = annotationManager.getAnnotation(annotationUID);
  annotationManager.removeAnnotation(annotationUID);

  const eventType = Events.ANNOTATION_REMOVED;
  const eventDetail: AnnotationRemovedEventDetail = {
    annotation,
  };

  triggerEvent(eventTarget, eventType, eventDetail);
}

/**
 * Get the Annotation object by its UID
 * @param annotationUID - The unique identifier of the annotation.
 * @param element - The element that the tool is being used on.
 * @returns A Annotation object.
 */
function getAnnotation(annotationUID: string): Annotation {
  const annotationManager = getDefaultAnnotationManager();
  const annotation = annotationManager.getAnnotation(annotationUID);

  return annotation;
}

export {
  getAnnotations,
  addAnnotation,
  getAnnotation,
  removeAnnotation,
  getDefaultAnnotationManager,
};
