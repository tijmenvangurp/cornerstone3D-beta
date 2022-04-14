import {
  getEnabledElementByIds,
  getRenderingEngine,
} from '@cornerstonejs/core';
import { getToolGroupsWithToolName } from '../../store/ToolGroupManager';
import triggerAnnotationRenderForViewportIds from '../../utilities/triggerAnnotationRenderForViewportIds';

/**
 * This is a callback function that is called when an annotation is modified.
 * Since we are throttling the cachedStats calculation for annotation tools,
 * we need to trigger a final render for the annotation. so that the annotation
 * textBox is updated.
 * Todo: This will trigger all the annotation tools to re-render, although DOM
 * will update those that have changed, but more efficient would be to only
 * update the changed annotation.
 * Todo: A better way is to extract the textBox render logic from the renderAnnotation
 * of all tools and just trigger a render for that (instead of the entire annotation., even if
 * no svg update happens since the attributes for handles are the same)
 */
function annotationModifiedListener(evt): void {
  const { annotation } = evt.detail;
  const { toolName } = annotation.metadata;

  // Get the toolGroups that has the toolName as active, passive or enabled
  const toolGroups = getToolGroupsWithToolName(toolName);

  if (!toolGroups.length) {
    return;
  }

  // Find the viewports in the toolGroups who has the same FrameOfReferenceUID
  const viewportsToRender = [];

  toolGroups.forEach((toolGroup) => {
    // @ts-ignore
    toolGroup.viewportsInfo.forEach((viewportInfo) => {
      const { renderingEngineId, viewportId } = viewportInfo;
      const { FrameOfReferenceUID } = getEnabledElementByIds(
        viewportId,
        renderingEngineId
      );

      if (annotation.metadata.FrameOfReferenceUID === FrameOfReferenceUID) {
        viewportsToRender.push(viewportInfo);
      }
    });
  });

  // Group the viewports by renderingEngineId
  const groupedViewports = {};
  viewportsToRender.forEach(({ renderingEngineId, viewportId }) => {
    if (!groupedViewports[renderingEngineId]) {
      groupedViewports[renderingEngineId] = [];
    }

    groupedViewports[renderingEngineId].push(viewportId);
  });

  // Trigger the render for the viewports
  Object.keys(groupedViewports).forEach((renderingEngineId) => {
    const renderingEngine = getRenderingEngine(renderingEngineId);

    triggerAnnotationRenderForViewportIds(
      renderingEngine,
      groupedViewports[renderingEngineId]
    );
  });
}

export default annotationModifiedListener;
