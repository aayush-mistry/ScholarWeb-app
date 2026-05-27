const { GoogleGenAI, GoogleGenAi, GoogleGenAiClient, GoogleGenerativeAI } = require('@google/generative-ai');

// Function to get Gemini API Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[Gemini Service] GEMINI_API_KEY is not configured. Falling back to mock generator.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Parses raw syllabus and PYQ text using Gemini AI into a structured ScholarDNA format.
 * Falls back to mock data if API key is missing.
 */
const generateScholarDNA = async (syllabusText, pyqText = '', notesText = '', courseName = 'Dynamic Syllabus Course') => {
  const genAI = getGeminiClient();

  // If no API Key, trigger simulated parsing fallback (perfect for fast hackathon testing)
  if (!genAI) {
    return generateMockScholarDNA(courseName, pyqText.length > 0);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const systemPrompt = `
      You are the Lead ScholarDNA Extraction AI. Your task is to analyze a raw syllabus text, an optional Past Year Questions (PYQ) text, and optional study notes, and compile them into a unified, high-fidelity JSON structure representing a standardized course map.

      RULES:
      1. Extract all logical course Units, Topics, and Subtopics.
      2. Set a unique, alphanumeric topic ID (camelCase/snake_case) for every extracted topic (e.g. "unit1_limits", "topic_matrices").
      3. For each topic, assess its "importance" as 'high', 'medium', or 'low' based on syllabus complexity and notes.
      4. Look at the PYQ text. Count how many questions or mentions are direct matches or relate closely to each topic. Assign this number to "pyqFrequency".
      5. Calculate the percentage "weightage" for each topic. The sum of all topic weightages should approximately equal 100%. If PYQ frequency is higher for a topic, increase its weightage.
      6. Determine "prerequisites" for each topic. A topic is a prerequisite if it contains foundational concepts needed before learning the target topic (e.g., 'limits' is a prerequisite for 'derivatives'). Use the unique topic IDs you defined.
      7. Provide short reference summaries or key textbook definitions/formulas in "referenceMaterials".

      JSON Schema output format:
      {
        "courseName": "Name of the Course",
        "courseDescription": "Brief description of the course contents",
        "units": [
          {
            "unitNumber": 1,
            "title": "Unit Title",
            "description": "Short description of the unit scope",
            "topics": [
              {
                "id": "unique_topic_id",
                "title": "Topic Title",
                "description": "Topic Description",
                "subtopics": [
                  {
                    "title": "Subtopic Title",
                    "description": "Brief scope"
                  }
                ],
                "importance": "high" | "medium" | "low",
                "pyqFrequency": 3,
                "weightage": 12,
                "prerequisites": ["prerequisite_topic_id"],
                "referenceMaterials": ["Core definition/formula 1"]
              }
            ]
          }
        ]
      }
    `;

    const userPrompt = `
      Syllabus Text:
      ---
      ${syllabusText}
      ---

      Past Year Questions (PYQs) Text:
      ---
      ${pyqText}
      ---

      Additional Notes:
      ---
      ${notesText}
      ---

      Construct the ScholarDNA JSON profile now:
    `;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt }
    ]);

    const rawResponse = result.response.text();
    const parsedData = JSON.parse(rawResponse);
    return parsedData;

  } catch (error) {
    console.error(`[Gemini Service Error] Extraction failed: ${error.message}. Returning mock data.`);
    return generateMockScholarDNA(courseName, pyqText.length > 0);
  }
};

/**
 * Mock data generator for fallback testing
 */
const generateMockScholarDNA = (courseName, hasPyqs = false) => {
  console.log('[Gemini Service] Simulating ScholarDNA extraction...');
  
  const calculatedCourseName = courseName !== 'Dynamic Syllabus Course' ? courseName : 'CS 101: Data Structures & Algorithms';

  return {
    courseName: calculatedCourseName,
    courseDescription: "Foundational course exploring computational efficiency, object-oriented concepts, trees, dynamic graphs, and core algorithm design schemas.",
    units: [
      {
        unitNumber: 1,
        title: "Complexity & Linear Structures",
        description: "Introduction to algorithmic analytics, Big-O notation, and linear storage matrices.",
        topics: [
          {
            id: "big_o_analysis",
            title: "Time & Space Complexity",
            description: "Evaluating execution runtimes using mathematical boundaries (Big-O, Theta, Omega).",
            subtopics: [
              { title: "Worst-case running time", description: "Calculating asymptotic upper bounds" },
              { title: "Space complexity allocations", description: "Auxiliary memory analysis" }
            ],
            importance: "high",
            pyqFrequency: hasPyqs ? 8 : 4,
            weightage: 18,
            prerequisites: [],
            referenceMaterials: ["T(n) = O(f(n)) iff exist c, n0 such that T(n) <= c*f(n) for all n >= n0."]
          },
          {
            id: "linked_lists",
            title: "Singly & Doubly Linked Lists",
            description: "Dynamic memory structures utilizing pointers for sequential node configurations.",
            subtopics: [
              { title: "Node insertions & deletions", description: "Pointer updates at head, tail, and middle positions" },
              { title: "List reversals", description: "In-place pointer reversal algorithms" }
            ],
            importance: "medium",
            pyqFrequency: hasPyqs ? 5 : 2,
            weightage: 12,
            prerequisites: ["big_o_analysis"],
            referenceMaterials: ["Linked list insertion complexity: O(1) if pointer is given, search is O(N)."]
          }
        ]
      },
      {
        unitNumber: 2,
        title: "Non-Linear Structures & Trees",
        description: "Hierarchical storage systems including branching search configurations and balance models.",
        topics: [
          {
            id: "binary_trees",
            title: "Binary Search Trees (BST)",
            description: "Branching nodes ensuring left elements are lesser and right elements are greater.",
            subtopics: [
              { title: "In-order, Pre-order, Post-order Traversals", description: "Recursive node explorations" },
              { title: "BST Searches & Insertions", description: "Dynamic tree mutations" }
            ],
            importance: "high",
            pyqFrequency: hasPyqs ? 12 : 6,
            weightage: 25,
            prerequisites: ["linked_lists"],
            referenceMaterials: ["Average BST Search complexity: O(log N). Worst case O(N) if skewed."]
          },
          {
            id: "avl_trees",
            title: "Self-Balancing AVL Trees",
            description: "Ensuring node balance heights remain within bounds via tree rotations.",
            subtopics: [
              { title: "Balance Factor calculations", description: "Left height minus right height differentials" },
              { title: "Single and Double rotations", description: "LL, RR, LR, RL balancing maneuvers" }
            ],
            importance: "high",
            pyqFrequency: hasPyqs ? 7 : 3,
            weightage: 15,
            prerequisites: ["binary_trees"],
            referenceMaterials: ["AVL guarantees O(log N) worst-case search by enforcing |heightDiff| <= 1."]
          }
        ]
      },
      {
        unitNumber: 3,
        title: "Graph Theory & Dynamic Routing",
        description: "Interconnected node topologies and optimal path calculations.",
        topics: [
          {
            id: "graph_traversals",
            title: "Breadth-First & Depth-First Search",
            description: "Exploring vertices systematically utilizing queue and stack structures.",
            subtopics: [
              { title: "BFS levels exploration", description: "Using FIFO queues for shortest unweighted paths" },
              { title: "DFS recursive tracking", description: "Using LIFO stacks and backtracking" }
            ],
            importance: "high",
            pyqFrequency: hasPyqs ? 9 : 5,
            weightage: 20,
            prerequisites: ["linked_lists"],
            referenceMaterials: ["BFS/DFS complexity: O(V + E) using adjacency list representation."]
          },
          {
            id: "shortest_paths",
            title: "Dijkstra's Shortest Path Algorithm",
            description: "Calculating optimal distances in non-negative weighted graphs using greedy approaches.",
            subtopics: [
              { title: "Relaxation steps", description: "Dynamic updates of node distance parameters" },
              { title: "Min-Priority Queue integration", description: "Accelerating vertex selections" }
            ],
            importance: "high",
            pyqFrequency: hasPyqs ? 10 : 4,
            weightage: 10,
            prerequisites: ["graph_traversals"],
            referenceMaterials: ["Dijkstra runtime: O((V + E) log V) with binary heap priority queues."]
          }
        ]
      }
    ]
  };
};

module.exports = {
  generateScholarDNA
};
