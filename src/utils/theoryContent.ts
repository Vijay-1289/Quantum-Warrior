
import { type QuantumLevel } from '@/data/quantumLevels';

export const getEnhancedTheoryContent = (level: QuantumLevel): string => {
  const theoryContent: Record<number, string> = {
    1: `CLASSICAL VS QUANTUM COMPUTING: THE FUNDAMENTAL PARADIGM SHIFT

Classical Computing Foundation:
Classical computers process information using bits - fundamental units that exist in definite states of either 0 or 1. This binary system forms the backbone of all classical computation, where logic gates perform deterministic operations on these well-defined states.

The Quantum Revolution:
Quantum computing introduces qubits (quantum bits) that can exist in superposition - a fundamental quantum phenomenon where a particle simultaneously occupies multiple states. Unlike classical bits, qubits can be in a combination of |0⟩ and |1⟩ states, mathematically represented as α|0⟩ + β|1⟩, where α and β are complex probability amplitudes.

Computational Implications:
While classical computers process information sequentially through deterministic pathways, quantum computers leverage superposition to explore multiple computational paths simultaneously. This quantum parallelism, combined with phenomena like entanglement and interference, enables certain quantum algorithms to achieve exponential speedups over their classical counterparts.

Measurement and Reality:
The act of measurement in quantum systems causes wavefunction collapse, forcing the qubit into a definite classical state. This fundamental difference between quantum computation (probabilistic) and classical computation (deterministic) represents one of the most profound shifts in computational thinking.`,

    2: `QUBITS AND SUPERPOSITION: THE HEART OF QUANTUM COMPUTATION

Mathematical Foundation:
A qubit state |ψ⟩ = α|0⟩ + β|1⟩ represents a unit vector in a two-dimensional complex vector space called a Hilbert space. The coefficients α and β are complex numbers satisfying the normalization condition |α|² + |β|² = 1, ensuring that the total probability equals one.

Bloch Sphere Representation:
Any qubit state can be visualized on the Bloch sphere - a geometric representation where the north and south poles represent the computational basis states |0⟩ and |1⟩. Points on the sphere's surface represent all possible qubit states, with the equator containing equal superposition states like (|0⟩ + |1⟩)/√2.

Physical Implementations:
Qubits can be physically realized using various quantum systems: electron spin in quantum dots, photon polarization, atomic energy levels, or superconducting circuits. Each implementation has unique advantages in terms of coherence time, gate fidelity, and scalability.

Coherence and Decoherence:
Quantum superposition is fragile and susceptible to environmental interference, leading to decoherence - the gradual loss of quantum properties. Maintaining coherence requires sophisticated error correction and isolation techniques, making quantum computation a delicate balance between harnessing quantum effects and preserving them from environmental noise.

Measurement Statistics:
When measuring a qubit in superposition α|0⟩ + β|1⟩, the probability of obtaining outcome 0 is |α|² and outcome 1 is |β|². The measurement process is fundamentally probabilistic, distinguishing quantum computation from classical deterministic operations.`,

    3: `QUANTUM GATES AND OPERATIONS: MANIPULATING QUANTUM REALITY

Universal Gate Sets:
Quantum computation relies on quantum gates - unitary operations that reversibly transform qubit states. A universal gate set can approximate any quantum operation to arbitrary precision. The Clifford+T gate set, consisting of Hadamard (H), Phase (S), CNOT, and T gates, provides universal quantum computation.

Single-Qubit Gates:
The Hadamard gate H transforms |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2, creating superposition states. Pauli gates (X, Y, Z) perform rotations around different axes of the Bloch sphere: X-gate flips computational basis states, Y-gate performs a combined flip and phase rotation, while Z-gate applies a phase flip to |1⟩.

Two-Qubit Gates:
The CNOT (Controlled-NOT) gate creates entanglement between qubits, applying an X-gate to the target qubit conditional on the control qubit being |1⟩. This gate is essential for creating multi-qubit entangled states and implementing quantum algorithms.

Quantum Circuit Model:
Quantum algorithms are represented as quantum circuits - sequences of quantum gates applied to qubits over time. The circuit model provides a framework for designing and analyzing quantum algorithms, with circuit depth and gate count determining computational complexity.

Gate Fidelity and Errors:
Real quantum gates suffer from imperfections due to environmental noise, control errors, and fundamental physical limitations. Gate fidelity measures how closely a physical gate approximates the ideal mathematical operation, with error rates typically ranging from 0.1% to 1% in current quantum devices.`,

    4: `DIGITAL IMAGE PROCESSING: FOUNDATIONS FOR QUANTUM ENHANCEMENT

Pixel-Based Representation:
Digital images consist of discrete picture elements (pixels) arranged in a grid structure. Each pixel contains color information encoded in various formats: RGB (Red, Green, Blue) for color images, or grayscale values for monochrome images. Image dimensions (width × height × color channels) determine the total data size.

Color Spaces and Encoding:
RGB color space represents colors as combinations of red, green, and blue intensities, typically using 8 bits per channel (0-255 range). Other color spaces like HSV (Hue, Saturation, Value) and CMYK (Cyan, Magenta, Yellow, Key/Black) serve specific applications in image processing and printing.

Spatial and Frequency Domains:
Image processing operates in both spatial domain (direct pixel manipulation) and frequency domain (using transforms like Fourier Transform). Frequency domain analysis reveals periodic patterns and enables efficient filtering operations for noise reduction, compression, and feature extraction.

Filtering and Convolution:
Digital filters modify images through convolution operations - mathematical processes that combine input pixels with filter kernels to produce output pixels. Common filters include Gaussian blur (noise reduction), Sobel edge detection, and sharpening filters that enhance specific image features.

Image Enhancement Techniques:
Histogram equalization improves image contrast by redistributing pixel intensities. Morphological operations (dilation, erosion) modify object shapes and sizes. Edge detection algorithms identify boundaries between different regions, essential for computer vision and pattern recognition applications.`,

    5: `QUANTUM ALGORITHMS: EXPONENTIAL ADVANTAGES IN COMPUTATION

Grover's Search Algorithm:
Grover's algorithm provides quadratic speedup for unstructured search problems. While classical algorithms require O(N) time to search unsorted databases, Grover's algorithm achieves O(√N) complexity through amplitude amplification - a technique that increases the probability of measuring correct answers while decreasing incorrect ones.

Amplitude Amplification Process:
The algorithm works by applying a sequence of unitary operations: oracle marking (inverting the amplitude of target states) followed by diffusion operator (reflecting about the average amplitude). This process geometrically rotates the state vector toward the target state, requiring approximately π/4 × √N iterations.

Shor's Factoring Algorithm:
Shor's algorithm factors large integers exponentially faster than known classical algorithms by exploiting the quantum Fourier transform to find periods in modular exponentiation. The algorithm's polynomial-time complexity threatens RSA encryption, motivating the development of post-quantum cryptography.

Quantum Fourier Transform:
The QFT is the quantum analog of the discrete Fourier transform, operating on quantum superposition states. It transforms computational basis states to Fourier basis states, enabling efficient period finding and solving hidden subgroup problems in various mathematical structures.

Quantum Speedup Sources:
Quantum algorithms achieve advantages through quantum parallelism (superposition enables simultaneous exploration of multiple solution paths), quantum interference (constructive/destructive interference amplifies correct answers), and entanglement (creates correlations impossible in classical systems).`,

    6: `QUANTUM IMAGE PROCESSING: CONVERGENCE OF QUANTUM AND VISUAL COMPUTING

Quantum Image Representations:
Quantum image processing requires encoding classical pixel data into quantum states. The Flexible Representation of Quantum Images (FRQI) encodes grayscale images as quantum superposition states, where pixel positions are encoded in computational basis states and intensities are encoded as rotation angles.

NEQR and Enhanced Representations:
Novel Enhanced Quantum Representation (NEQR) improves upon FRQI by storing pixel intensities directly in quantum states rather than angles, enabling more efficient quantum operations. Multi-Channel Representation for Quantum Images (MCRQI) extends these concepts to color images with RGB channels.

Quantum Image Operations:
Basic quantum image operations include geometric transformations (rotation, scaling, translation) implemented through quantum gates, color manipulations using controlled rotations, and filtering operations leveraging quantum superposition to process multiple image regions simultaneously.

Entanglement in Image Processing:
Quantum entanglement enables novel image processing capabilities: entangled pixels can exhibit correlations impossible in classical systems, potentially enabling parallel feature detection across spatially separated image regions and enhanced pattern recognition through quantum interference.

Quantum Speedup Potential:
Theoretical quantum image processing algorithms promise exponential speedups for specific tasks: quantum pattern matching using Grover-like algorithms, quantum principal component analysis for image compression, and quantum machine learning approaches for image classification and recognition.

Challenges and Future Directions:
Current quantum image processing faces significant challenges: efficient classical-to-quantum data encoding, noise resilience in intermediate-scale quantum devices, and developing quantum algorithms that demonstrate clear advantages over classical methods. Future developments may include quantum convolutional neural networks and quantum-enhanced computer vision systems.`
  };
  
  return theoryContent[level.id] || theoryContent[1];
};
