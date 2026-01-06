"use client";

import { motion } from "framer-motion";
import {
  GitFork,
  Monitor,
  Users,
  Layers,
  FileCode,
  Network,
} from "lucide-react";

// Reusable Node Card Component
const Node = ({
  label,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  icon?: any;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative z-10 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center shadow-xl backdrop-blur-md transition-all hover:border-blue-500/30 hover:bg-slate-800/80"
  >
    {Icon && <Icon className="h-5 w-5 text-blue-400" />}
    <span className="max-w-[120px] text-xs font-semibold text-slate-200">
      {label}
    </span>
  </motion.div>
);

// Vertical connecting line
const VLine = ({ height = "h-8" }: { height?: string }) => (
  <div
    className={`w-px ${height} mx-auto bg-gradient-to-b from-blue-500/50 to-purple-500/50`}
  />
);

// Horizontal connecting line (The bracket)
const HLine = ({ width = "w-full" }: { width?: string }) => (
  <div
    className={`h-px ${width} mx-auto bg-gradient-to-r from-transparent via-blue-500/50 to-transparent`}
  />
);

export default function FlowchartSection() {
  return (
    <div className="w-full py-12">
      <div className="flex flex-col items-center">
        {/* --- LEVEL 1: Root --- */}
        <Node label="TR Solution Template" icon={Network} delay={0} />
        <VLine height="h-8" />
        {/* Splitter Line */}
        <div className="relative h-px w-1/2 max-w-lg bg-white/10">
          {/* Visual connectors to children */}
          <div className="absolute left-0 top-0 h-4 w-px bg-white/10" />
          <div className="absolute right-0 top-0 h-4 w-px bg-white/10" />
          <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 -translate-y-4 bg-white/10" />
        </div>
        <div className="h-4" /> {/* Spacer */}
        {/* --- LEVEL 2: Branches --- */}
        <div className="grid w-full max-w-4xl grid-cols-2 gap-8 px-4">
          {/* LEFT BRANCH: Client Specific */}
          <div className="flex flex-col items-center">
            <Node label="Client-Specific Solutions" icon={Users} delay={0.2} />
            <VLine height="h-8" />
            {/* Splitter for children */}
            <div className="relative my-2 h-px w-11/12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* LEVEL 3: Left Leaves */}
            <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-2">
              <Node label="Demo (All Route)" delay={0.6} icon={Monitor} />
              <Node label="Demo (Twilio/US)" delay={0.7} icon={Monitor} />
            </div>
          </div>

          {/* RIGHT BRANCH: Generic */}
          <div className="flex flex-col items-center">
            <Node
              label="Generic Templates & Solutions"
              icon={Layers}
              delay={0.3}
            />
            <VLine height="h-8" />
            {/* Splitter for children */}
            <div className="relative my-2 h-px w-11/12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* LEVEL 3: Right Leaves */}
            <div className="mt-4 grid w-full grid-cols-3 gap-3">
              <Node
                label="Master Template Project"
                delay={0.5}
                icon={FileCode}
              />
              <Node label="Client Specific Solutions" delay={0.6} />
              <Node label="Generic Templates" delay={0.7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
