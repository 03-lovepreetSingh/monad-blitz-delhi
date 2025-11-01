"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { useWalletClient, usePublicClient } from "wagmi";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  MessageCircle,
  X,
  Linkedin,
  Wallet,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
interface UserSession {
  user?: {
    username?: string;
    email?: string;
    name?: string;
    image?: string;
  };
}
import { useSignup } from "../../context/SignupContext";


interface FormData {
  metaMask: string;
  Location: string;
  Bio: string;
  Telegram: string;
  Twitter: string;
  Linkedin: string;
  skills: string[];
  termsAccepted: boolean;
  formFilled: boolean;
}

const PROGRAMMING_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Solidity",
  "Web3",
  "Blockchain",
  "Smart Contracts",
  "DeFi",
  "NFT",
  "Docker",
  "Kubernetes",
  "AWS",
  "MongoDB",
];

const abi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function MultiStepSignup() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [contractAddress, setContractAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession() as { data: UserSession | null };
  const [showSignup, setSShowSignup] = useState(false);
  const { setShowSignup: setContextShowSignup } = useSignup();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [formData, setFormData] = useState<FormData>({
    metaMask: contractAddress,
    Location: "",
    Bio: "",
    Telegram: "",
    Twitter: "",
    Linkedin: "",
    skills: [],
    formFilled: true,
    termsAccepted: false,
  });
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user?.username) return;

      try {
        const res = await fetch(
          `/api/publicProfile?username=${session.user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const userData = data.user?.[0];

          if (userData) {
            setSShowSignup(!userData?.formFilled);
            setContextShowSignup(!userData?.formFilled);
          } else {
            // If no user data, show signup form
            setSShowSignup(true);
            setContextShowSignup(true);
          }
        } else {
          // If API error, show signup form
          setSShowSignup(true);
          setContextShowSignup(true);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // If network error, show signup form
        setSShowSignup(true);
        setContextShowSignup(true);
      }
    };

    fetchUsers();
  }, [session?.user?.username]);

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      updateFormData("skills", [...formData.skills, skill]);
    }
  };

  
  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.termsAccepted;
      case 2:
        return formData.metaMask.trim() !== "";
      case 3:
        return formData.Location.trim() !== "" && formData.Bio.trim() !== "";
      case 4:
        return formData.skills.length > 0;
      default:
        return false;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function createWallet() {
    try {
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?.username, // Replace with actual user ID or username
          walletBalance: "0", // Must be string if using Decimal in DB
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Wallet error:", data.error);
        return;
      }
    } catch (error) {
      console.error("❌ Network or server error:", error);
    }
  }

  const handleSubmit = async () => {
    if (!session?.user) {
      setSubmitError("User session not available");
      return;
    }
    createWallet();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const postData = {
        ...formData,
        skills: JSON.stringify(formData.skills),
        image_url: session.user.image || "",
        id: session.user.username,
        fullName: session.user.name || "",
        email: session.user.email,
      };

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        setIsComplete(true);
        // Close signup after successful submission
        setTimeout(() => {
          setSShowSignup(false);
          setContextShowSignup(false);
        }, 2000);
      } else {
        const errorData = await res.json();
        setSubmitError(errorData.message || "Failed to submit form");
      }
    } catch (error) {
      setSubmitError("Network error: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      updateFormData(
        "skills",
        formData.skills.filter((s) => s !== skill),
      );
    } else {
      updateFormData("skills", [...formData.skills, skill]);
    }
  };

  const createContract = async () => {
    if (!walletClient) {
      setError("Wallet client not found. Please connect your wallet.");
      return;
    }
    if (!publicClient) {
      setError("Public client not available.");
      return;
    }

    setIsDeploying(true);
    setError("");
    setContractAddress("");

    try {
      const hash = await walletClient.deployContract({
        abi: abi,
        bytecode:
          "0x6080604052348015600e575f5ffd5b50335f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506107fc8061005b5f395ff3fe608060405260043610610041575f3560e01c8062f714ce1461009a57806312065fe0146100c25780638da5cb5b146100ec578063d0e30db01461011657610096565b36610096573373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405161008c919061042f565b60405180910390a2005b5f5ffd5b3480156100a5575f5ffd5b506100c060048036038101906100bb91906104d0565b610120565b005b3480156100cd575f5ffd5b506100d661035a565b6040516100e3919061042f565b60405180910390f35b3480156100f7575f5ffd5b50610100610361565b60405161010d919061052e565b60405180910390f35b61011e610385565b005b5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101ae576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101a5906105a1565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361021c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161021390610609565b60405180910390fd5b8147101561025f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161025690610671565b60405180910390fd5b5f8173ffffffffffffffffffffffffffffffffffffffff1683604051610284906106bc565b5f6040518083038185875af1925050503d805f81146102be576040519150601f19603f3d011682016040523d82523d5f602084013e6102c3565b606091505b5050905080610307576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fe9061071a565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243648460405161034d919061042f565b60405180910390a2505050565b5f47905090565b5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f34116103c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103be906107a8565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405161040d919061042f565b60405180910390a2565b5f819050919050565b61042981610417565b82525050565b5f6020820190506104425f830184610420565b92915050565b5f5ffd5b61045581610417565b811461045f575f5ffd5b50565b5f813590506104708161044c565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61049f82610476565b9050919050565b6104af81610495565b81146104b9575f5ffd5b50565b5f813590506104ca816104a6565b92915050565b5f5f604083850312156104e6576104e5610448565b5b5f6104f385828601610462565b9250506020610504858286016104bc565b9150509250929050565b5f61051882610476565b9050919050565b6105288161050e565b82525050565b5f6020820190506105415f83018461051f565b92915050565b5f82825260208201905092915050565b7f43616c6c6572206973206e6f7420746865206f776e65720000000000000000005f82015250565b5f61058b601783610547565b915061059682610557565b602082019050919050565b5f6020820190508181035f8301526105b88161057f565b9050919050565b7f496e76616c696420726563697069656e742061646472657373000000000000005f82015250565b5f6105f3601983610547565b91506105fe826105bf565b602082019050919050565b5f6020820190508181035f830152610620816105e7565b9050919050565b7f496e73756666696369656e7420636f6e74726163742062616c616e63650000005f82015250565b5f61065b601d83610547565b915061066682610627565b602082019050919050565b5f6020820190508181035f8301526106888161064f565b9050919050565b5f81905092915050565b50565b5f6106a75f8361068f565b91506106b282610699565b5f82019050919050565b5f6106c68261069c565b9150819050919050565b7f4574686572207472616e73666572206661696c656400000000000000000000005f82015250565b5f610704601583610547565b915061070f826106d0565b602082019050919050565b5f6020820190508181035f830152610731816106f8565b9050919050565b7f4465706f73697420616d6f756e74206d757374206265206772656174657220745f8201527f68616e207a65726f000000000000000000000000000000000000000000000000602082015250565b5f610792602883610547565b915061079d82610738565b604082019050919050565b5f6020820190508181035f8301526107bf81610786565b905091905056fea2646970667358221220c0996c6a2f52f74e26786a99d9de719b482d6204e0d5b0f9b2fd093212289d0064736f6c634300081e0033", // Should be imported from confi
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000, // 60 second timeout
      });

      if (!receipt.contractAddress) {
        throw new Error("Contract deployment failed - no address in receipt");
      }

      setContractAddress(receipt.contractAddress);
      updateFormData("metaMask", receipt.contractAddress);
    } catch (error) {
      console.error("Contract deployment error:", error);
      setError(
        `Failed to deploy contract: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeploying(false);
    }
  };

  
  // Success screen
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#0f0f1a] border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Profile Complete!</h2>
          <p className="text-gray-400 mb-8">
            Your profile has been successfully created. You can now start contributing to open source projects.
          </p>
          <Button
            onClick={() => {
              setIsComplete(false);
              setCurrentStep(1);
            }}
            className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl px-8 py-6 text-base"
          >
            View Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {showSignup && (
        <div className="fixed inset-0 z-[999] bg-[#0a0a0f] overflow-y-auto">
          {/* Header */}
          <header className="w-full py-6 px-6 lg:px-8 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <Image src="/NeowareLogo2.png" alt="Neoweave" width={140} height={36} className="h-9 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/80">Secure Signup</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                <span className="text-sm text-white font-medium">Step Progress</span>
              </div>
            </div>
          </header>

          {/* Main Content Container */}
          <div className="w-full px-6 lg:px-8 py-8">
            {/* Form and Profile Preview Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            {/* Left: Form */}
            <div className="w-full min-w-0">
              {/* Step Indicator */}
              <div className="mb-6 flex items-center justify-center lg:justify-start gap-3">
                <span className="text-white/60 text-sm font-medium">Step</span>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2">
                  <span className="text-white font-bold text-lg">{currentStep}/4</span>
                </div>
              </div>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f0f1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-10"
                  >

                                      {/* Error Display */}
                    {submitError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {submitError}
                      </div>
                    )}

                    {/* Step 1: Platform Agreement */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Openwave</h2>
                            <p className="text-gray-400">
                              Complete your profile in 4 simple steps to start contributing to open source projects
                            </p>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20">Free Plan</Badge>
                        </div>

                        <div className="bg-[#1a1a2e] rounded-2xl p-6 space-y-4 border border-white/5">
                          <h3 className="text-white font-semibold flex items-center gap-2">
                            <span className="text-red-400">•</span>
                            Openwave Platform Agreement
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            By joining Openwave, you agree to contribute to open-source projects and earn rewards based on
                            your contributions. This platform connects developers with meaningful projects and provides fair
                            compensation for quality work.
                          </p>

                          <div className="space-y-3">
                            <p className="text-white font-medium text-sm">Key Terms:</p>
                            <ul className="space-y-2 text-sm text-gray-400">
                              <li className="flex items-start gap-2">
                                <span className="text-gray-600">•</span>
                                <span>You must provide accurate information in your profile</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-600">•</span>
                                <span>All contributions must be original work or properly attributed</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-600">•</span>
                                <span>Rewards are distributed based on contribution quality and impact</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-600">•</span>
                                <span>You retain ownership of your contributions while granting usage rights</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-600">•</span>
                                <span>Platform fees may apply to certain transactions</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-gray-600">•</span>
                                <span>You agree to maintain professional conduct in all interactions</span>
                              </li>
                            </ul>

                            <p className="text-white font-medium text-sm mt-4">Privacy:</p>
                            <p className="text-gray-400 text-sm">
                              Your personal information is protected and will only be used for platform operations and
                              communication.
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/5">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <Checkbox
                              checked={formData.termsAccepted}
                              onCheckedChange={(checked) => updateFormData("termsAccepted", checked as boolean)}
                              className="mt-0.5 data-[state=checked]:bg-[#6366f1] data-[state=checked]:border-[#6366f1]"
                            />
                            <span className="text-gray-300 text-sm">I have read and agree to the Terms and Conditions</span>
                          </label>
                        </div>
                      </div>
                    )}
                  {/* Step 2: Connect Wallet */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
                          <p className="text-gray-400">Set up your wallet to receive rewards for your contributions</p>
                        </div>

                        <div className="bg-[#1a1a2e] rounded-2xl p-12 text-center space-y-6 border border-white/5">
                          <h3 className="text-white font-semibold text-xl">Connect to your wallet</h3>

                          {formData.metaMask ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-2 bg-[#0f0f1a] rounded-xl px-5 py-3 border border-white/10">
                                  <Wallet className="w-4 h-4 text-gray-400" />
                                  <span className="text-white text-sm font-medium">Connected</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#0f0f1a] rounded-xl px-5 py-3 border border-white/10">
                                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                                  <span className="text-gray-400 text-sm font-mono">
                                    {formData.metaMask.slice(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex justify-center mb-6">
                                {/* Placeholder for appkit-button */}
                                <appkit-button />
                              </div>
                              <Button
                                onClick={createContract}
                                disabled={isDeploying}
                                className="bg-[#6366f1] hover:bg-[#5558e3] text-white gap-2 rounded-xl px-8 py-6 text-base font-medium"
                              >
                                <Wallet className="w-5 h-5" />
                                {isDeploying ? "Deploying..." : "Sign Contract"}
                              </Button>
                            </div>
                          )}
                        </div>

                        {error && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                            <p className="text-red-400 text-sm">{error}</p>
                          </div>
                        )}
                        {contractAddress && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                            <p className="text-green-400 text-sm">
                              Contract deployed successfully! Address: {contractAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  {/* Step 3: Complete Profile */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h2>
                          <p className="text-gray-400">Tell us about yourself and your location</p>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <Label
                              htmlFor="location"
                              className="text-white mb-2 flex items-center gap-2 text-sm font-medium"
                            >
                              <MapPin className="w-4 h-4" />
                              Location *
                            </Label>
                            <Input
                              id="location"
                              value={formData.Location}
                              onChange={(e) => updateFormData("Location", e.target.value)}
                              placeholder="New Delhi"
                              className="bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#6366f1] focus:ring-[#6366f1]"
                            />
                          </div>

                          <div>
                            <Label htmlFor="bio" className="text-white mb-2 block text-sm font-medium">
                              Bio *
                            </Label>
                            <Textarea
                              id="bio"
                              value={formData.Bio}
                              onChange={(e) => updateFormData("Bio", e.target.value)}
                              placeholder="I am"
                              rows={6}
                              className="bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 resize-none rounded-xl focus:border-[#6366f1] focus:ring-[#6366f1]"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              This helps project maintainers understand your background
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* Step 4: Add Skills */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">Add Your Skills</h2>
                          <p className="text-gray-400">Showcase your expertise and connect your social profiles</p>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <Label className="text-white mb-3 block text-sm font-medium">Skills *</Label>
                            <div className="bg-[#1a1a2e] rounded-2xl p-5 space-y-4 border border-white/5">
                              <div className="flex flex-wrap gap-2">
                                {PROGRAMMING_SKILLS.map((skill) => (
                                  <Badge
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`cursor-pointer transition-all rounded-lg px-3 py-1.5 text-sm ${
                                      formData.skills.includes(skill)
                                        ? "bg-[#6366f1] hover:bg-[#5558e3] text-white border-transparent"
                                        : "bg-[#0f0f1a] hover:bg-[#1a1a2e] text-gray-400 border-white/10"
                                    }`}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Input
                                  value={customSkill}
                                  onChange={(e) => setCustomSkill(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                                  placeholder="Add custom skill..."
                                  className="bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 h-11 rounded-xl"
                                />
                                <Button
                                  onClick={addCustomSkill}
                                  size="icon"
                                  className="bg-[#6366f1] hover:bg-[#5558e3] shrink-0 h-11 w-11 rounded-xl"
                                >
                                  <Plus className="w-5 h-5" />
                                </Button>
                              </div>

                              {formData.skills.length > 0 && (
                                <div className="pt-3 border-t border-white/10">
                                  <p className="text-sm text-gray-400">
                                    {formData.skills.length} skills added • View in profile preview →
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label className="text-white mb-3 block text-sm font-medium">Social Links (Optional)</Label>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <Label htmlFor="telegram" className="text-gray-400 text-xs mb-1.5 block">
                                  Telegram
                                </Label>
                                <Input
                                  id="telegram"
                                  value={formData.Telegram}
                                  onChange={(e) => updateFormData("Telegram", e.target.value)}
                                  placeholder="@telegram"
                                  className="bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 h-11 rounded-xl"
                                />
                              </div>
                              <div>
                                <Label htmlFor="twitter" className="text-gray-400 text-xs mb-1.5 block">
                                  Twitter
                                </Label>
                                <Input
                                  id="twitter"
                                  value={formData.Twitter}
                                  onChange={(e) => updateFormData("Twitter", e.target.value)}
                                  placeholder="@𝕏"
                                  className="bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 h-11 rounded-xl"
                                />
                              </div>
                              <div>
                                <Label htmlFor="linkedin" className="text-gray-400 text-xs mb-1.5 block">
                                  Linkedin
                                </Label>
                                <Input
                                  id="linkedin"
                                  value={formData.Linkedin}
                                  onChange={(e) => updateFormData("Linkedin", e.target.value)}
                                  placeholder="@linkdin"
                                  className="bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 h-11 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="px-10 pb-10 flex items-center justify-between">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-xl px-6 py-6"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:opacity-50 rounded-xl px-8 py-6 text-base font-medium"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isSubmitting}
                      className="bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:opacity-50 rounded-xl px-8 py-6 text-base font-medium"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        "Complete Signup"
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right: Profile Preview Sidebar */}
            <div className="hidden lg:block w-[320px] flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#0f0f1a] border border-white/10 rounded-3xl p-6 sticky top-8 h-fit"
              >
                {/* Profile Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center mb-4 overflow-hidden">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-[#0f0f1a] flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="w-3 h-3 xl:w-4 xl:h-4 bg-green-400 rounded-sm"></div>
                          <div className="w-3 h-3 xl:w-4 xl:h-4 bg-teal-400 rounded-sm"></div>
                          <div className="w-3 h-3 xl:w-4 xl:h-4 bg-teal-400 rounded-sm"></div>
                          <div className="w-3 h-3 xl:w-4 xl:h-4 bg-green-400 rounded-sm"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg xl:text-xl font-bold text-white text-center">{session?.user?.name || "User"}</h3>
                  <p className="text-gray-400 text-xs xl:text-sm mt-1 text-center line-clamp-2">{formData.Bio || "I am"}</p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs xl:text-sm text-gray-300">Available for work</span>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SKILLS</h4>
                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 xl:gap-2">
                      {formData.skills.slice(0, 6).map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-white/5 text-white border-white/10 hover:bg-white/10 rounded-lg px-2 xl:px-3 py-0.5 xl:py-1 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {formData.skills.length > 6 && (
                        <Badge className="bg-white/5 text-gray-400 border-white/10 rounded-lg px-2 xl:px-3 py-0.5 xl:py-1 text-xs">
                          +{formData.skills.length - 6}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs xl:text-sm">No skills added yet</p>
                  )}
                </div>

                {/* Location Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">LOCATION</h4>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                    <span className="text-xs xl:text-sm truncate">{formData.Location || "New Delhi"}</span>
                  </div>
                </div>

                {/* Phone Section */}
                {formData.Telegram && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PHONE</h4>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                      <span className="text-xs xl:text-sm truncate">{formData.Telegram}</span>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(formData.Telegram || formData.Twitter || formData.Linkedin) && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SOCIAL</h4>
                    <div className="flex items-center gap-2 xl:gap-3">
                      {formData.Linkedin && (
                        <a
                          href={`https://linkedin.com/in/${formData.Linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 xl:w-9 xl:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Linkedin className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-300" />
                        </a>
                      )}
                      {formData.Twitter && (
                        <a
                          href={`https://twitter.com/${formData.Twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 xl:w-9 xl:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-300" />
                        </a>
                      )}
                      {formData.Telegram && (
                        <a
                          href={`https://t.me/${formData.Telegram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 xl:w-9 xl:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-300" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Resume Section */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">RESUME</h4>
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg
                      className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-xs xl:text-sm truncate">No resume uploaded</span>
                  </div>
                </div>
              </motion.div>
            </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
