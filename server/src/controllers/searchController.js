const ScholarDNA = require('../models/ScholarDNA');

/**
 * Syllabus-Aware Search API Controller
 */
const searchContent = async (req, res) => {
  try {
    const { q, dnaId } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Missing search query parameters.' });
    }

    // Default academic terms to allow if DNA is offline (for hackathon flexibility)
    const activeDnaId = dnaId || 'simulated';
    let activeDna = null;

    if (activeDnaId !== 'simulated' && activeDnaId.match(/^[0-9a-fA-F]{24}$/)) {
      activeDna = await ScholarDNA.findById(activeDnaId);
    }

    const queryLower = q.toLowerCase();

    // Out of scope trigger words (gaming, cooking, travel, gossip etc.)
    const blockList = ['pizza', 'bake', 'recipe', 'game', 'fortnite', 'gossip', 'celebrity', 'vacation', 'resort', 'flight', 'movies', 'music video'];
    const hasBlockWord = blockList.some(word => queryLower.includes(word));

    // Determine matching syllabus topics
    let matchedTopic = null;
    let matchedUnit = null;
    let relevanceScore = 0;

    if (activeDna && activeDna.units) {
      // Search inside the loaded ScholarDNA
      for (let unit of activeDna.units) {
        for (let topic of unit.topics) {
          const titleMatch = topic.title.toLowerCase().includes(queryLower) || queryLower.includes(topic.title.toLowerCase());
          const descMatch = topic.description?.toLowerCase().includes(queryLower);
          const subMatch = topic.subtopics?.some(sub => sub.title.toLowerCase().includes(queryLower));

          if (titleMatch || descMatch || subMatch) {
            matchedTopic = topic;
            matchedUnit = unit;
            relevanceScore = titleMatch ? 98 : descMatch ? 85 : 78;
            break;
          }
        }
        if (matchedTopic) break;
      }
    } else {
      // Fallback keyword matcher for Simulated offline DNA
      const fallbackTopics = [
        { id: "big_o_analysis", title: "Time & Space Complexity", unitNumber: 1, unitTitle: "Complexity & Linear Structures", pyq: 8, weight: 18 },
        { id: "linked_lists", title: "Singly & Doubly Linked Lists", unitNumber: 1, unitTitle: "Complexity & Linear Structures", pyq: 3, weight: 12 },
        { id: "binary_trees", title: "Binary Search Trees (BST)", unitNumber: 2, unitTitle: "Non-Linear Structures & Trees", pyq: 12, weight: 25 },
        { id: "avl_trees", title: "Self-Balancing AVL Trees", unitNumber: 2, unitTitle: "Non-Linear Structures & Trees", pyq: 5, weight: 15 },
        { id: "graph_traversals", title: "Breadth-First & Depth-First Search", unitNumber: 3, unitTitle: "Graph Theory & Dynamic Routing", pyq: 9, weight: 20 },
        { id: "shortest_paths", title: "Dijkstra's Shortest Path Algorithm", unitNumber: 3, unitTitle: "Graph Theory & Dynamic Routing", pyq: 7, weight: 10 }
      ];

      for (let topic of fallbackTopics) {
        if (queryLower.includes(topic.title.toLowerCase()) || topic.title.toLowerCase().includes(queryLower) ||
            queryLower.includes('complexity') || queryLower.includes('dijkstra') || queryLower.includes('tree') || queryLower.includes('list') || queryLower.includes('bfs') || queryLower.includes('dfs')) {
          matchedTopic = topic;
          matchedUnit = { unitNumber: topic.unitNumber, title: topic.unitTitle };
          relevanceScore = 95;
          break;
        }
      }
    }

    // Trigger Out-of-Scope Warning Shield if no syllabus topic matches, or contains block listed words
    if (hasBlockWord || !matchedTopic) {
      console.warn(`[Integrity Guard] blocked out-of-syllabus query: "${q}"`);
      return res.status(200).json({
        success: true,
        outOfScope: true,
        message: 'Search query falls outside active ScholarDNA syllabus scope.',
        results: []
      });
    }

    // Generate dynamic syllabus-aware results
    const searchResults = [
      {
        id: 'web_1',
        title: `Comprehensive Guide to ${matchedTopic.title}`,
        description: `Detailed textual explanation exploring core concepts of ${matchedTopic.title}. Includes practical examples, asymptotic boundaries, and mathematical proofs.`,
        source: 'Web Resource',
        url: 'https://scholarweb.edu/library/docs',
        type: 'article'
      },
      {
        id: 'yt_1',
        title: `${matchedTopic.title} Lectures // In-depth Explanation`,
        description: `Visual walkthrough of ${matchedTopic.title} covering structural operations, algorithmic complexities, and mock problem check-offs.`,
        source: 'YouTube Lecture',
        url: 'https://youtube.com/watch?v=academic_ref',
        type: 'video'
      },
      {
        id: 'wiki_1',
        title: `Wikipedia: ${matchedTopic.title}`,
        description: `Formal encyclopedia breakdown of ${matchedTopic.title}. Examines historical development, abstract formalizations, and related algorithms.`,
        source: 'Wikipedia Core',
        url: `https://wikipedia.org/wiki/${matchedTopic.title.replace(/\s+/g, '_')}`,
        type: 'wiki'
      }
    ];

    return res.status(200).json({
      success: true,
      outOfScope: false,
      query: q,
      results: searchResults,
      syllabusMapping: {
        nodeId: matchedTopic.id,
        topicTitle: matchedTopic.title,
        unitNumber: matchedUnit.unitNumber,
        unitTitle: matchedUnit.title,
        importance: matchedTopic.importance || 'high',
        pyqFrequency: matchedTopic.pyqFrequency || 5,
        weightage: matchedTopic.weightage || 15,
        relevanceScore
      }
    });

  } catch (error) {
    console.error(`[Search Controller Error] Execution failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to process syllabus-aware search query.',
      error: error.message
    });
  }
};

module.exports = {
  searchContent
};
