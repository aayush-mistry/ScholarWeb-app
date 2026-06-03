/**
 * Format graph data for React Flow visualization
 */
export const formatGraphNodes = (dna) => {
  if (!dna || !dna.units) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];

  dna.units.forEach((unit, unitIdx) => {
    unit.topics.forEach((topic, topicIdx) => {
      const posX = unitIdx * 280 + 80;
      const posY = topicIdx * 140 + 60;

      nodes.push({
        id: topic.id,
        type: 'customNode',
        data: {
          title: topic.title,
          masteryLevel: topic.masteryLevel || 0,
          importance: topic.importance,
          id: topic.id,
          description: topic.description,
          subtopics: topic.subtopics,
          referenceMaterials: topic.referenceMaterials,
          unitTitle: unit.title,
          unitNumber: unit.unitNumber,
        },
        position: { x: posX, y: posY },
      });

      // Add prerequisite edges
      if (topic.prerequisites && topic.prerequisites.length > 0) {
        topic.prerequisites.forEach((prereqId) => {
          const isPrereqMastered = dna.units.some((u) =>
            u.topics.some((t) => t.id === prereqId && t.masteryLevel >= 80)
          );

          edges.push({
            id: `edge-${prereqId}-${topic.id}`,
            source: prereqId,
            target: topic.id,
            animated: true,
            style: {
              stroke: isPrereqMastered ? '#22C55E' : '#FF9900',
              strokeWidth: 2,
              strokeDasharray: '6 6',
            },
          });
        });
      }
    });
  });

  return { nodes, edges };
};

export default formatGraphNodes;
