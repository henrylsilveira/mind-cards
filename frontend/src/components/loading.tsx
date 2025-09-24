
import { motion } from "framer-motion"
import { Brain, BookOpen, Zap, Target } from "lucide-react"
import { cn } from "../libs/utils/tw-merge"


interface ThemedLoadingProps {
  size?: "sm" | "md" | "lg"
  variant?: "cards" | "brain" | "neurons" | "shuffle" | "synapse"
  className?: string
  text?: string
}

export function ThemedLoading({ size = "md", variant = "cards", className, text }: ThemedLoadingProps) {
  const sizeClasses = {
    sm: { container: "w-12 h-12", text: "text-xs" },
    md: { container: "w-20 h-20", text: "text-sm" },
    lg: { container: "w-32 h-32", text: "text-base" },
  }

  const containerSizes = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  }

  // Variante: Cards Flipando
  if (variant === "cards") {
    const cardSize = {
      sm: "w-6 h-8",
      md: "w-8 h-12",
      lg: "w-12 h-16",
    }

    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <div className="relative flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={cn(cardSize[size], "rounded-lg shadow-lg border-2 border-primary/20 relative overflow-hidden")}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              animate={{
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.3,
                ease: "easeInOut",
              }}
            >
              {/* Frente do card */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <BookOpen className="w-1/2 h-1/2 text-white/80" />
              </motion.div>

              {/* Verso do card */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <Target className="w-1/2 h-1/2 text-white/80" />
              </motion.div>

              {/* Brilho animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.3,
                }}
              />
            </motion.div>
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-muted-foreground font-medium text-center", sizeClasses[size].text)}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  // Variante: Cérebro Pulsante
  if (variant === "brain") {
    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <div className={cn("relative", sizeClasses[size].container)}>
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-3/4 h-3/4 text-white drop-shadow-lg" />
          </motion.div>

          {/* Partículas ao redor */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/60 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                rotate: [0, 360],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
              initial={{
                x: Math.cos((i * 60 * Math.PI) / 180) * 40,
                y: Math.sin((i * 60 * Math.PI) / 180) * 40,
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-muted-foreground font-medium text-center", sizeClasses[size].text)}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  // Variante: Neurônios Conectando
  if (variant === "neurons") {
    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <div className={cn("relative", sizeClasses[size].container)}>
          {/* Neurônios */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-primary rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: `${20 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Conexões */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-0.5 bg-gradient-to-r from-primary/60 to-transparent origin-left"
              style={{
                top: `${25 + i * 15}%`,
                left: `${25 + i * 15}%`,
                width: "30%",
                transform: `rotate(${45 + i * 20}deg)`,
              }}
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-muted-foreground font-medium text-center", sizeClasses[size].text)}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  // Variante: Cards Embaralhando
  if (variant === "shuffle") {
    const cardSize = {
      sm: "w-8 h-10",
      md: "w-10 h-14",
      lg: "w-14 h-20",
    }

    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <div className="relative">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className={cn(cardSize[size], "absolute rounded-lg shadow-lg border border-primary/30")}
              style={{
                background: `linear-gradient(135deg, hsl(${220 + index * 20}, 70%, ${60 + index * 5}%), hsl(${240 + index * 20}, 80%, ${70 + index * 5}%))`,
                zIndex: 4 - index,
              }}
              animate={{
                x: [0, 20, -20, 0],
                y: [0, -10, 10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-4 h-4 bg-white/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.1,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-muted-foreground font-medium text-center mt-16", sizeClasses[size].text)}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  // Variante: Sinapses
  if (variant === "synapse") {
    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <div className={cn("relative", sizeClasses[size].container)}>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Zap className="w-1/2 h-1/2 text-white" />
          </motion.div>

          {/* Ondas de energia */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-primary/30 rounded-full"
              animate={{
                scale: [0.5, 1.5],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.7,
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-muted-foreground font-medium text-center", sizeClasses[size].text)}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  return null
}

// Componentes específicos temáticos
export function MemoryCardLoading({
  text = "Processando memórias...",
  className,
}: { text?: string; className?: string }) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20",
        className,
      )}
    >
      <ThemedLoading size="lg" variant="cards" text={text} />
    </div>
  )
}

export function BrainLoading({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <ThemedLoading size="md" variant="brain" text={text} />
    </div>
  )
}

export function StudyLoading({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <ThemedLoading size="md" variant="neurons" text={text} />
    </div>
  )
}

export function GameLoading({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <ThemedLoading size="md" variant="shuffle" text={text} />
    </div>
  )
}

export function ProcessingLoading({ className }: { className?: string }) {
  return <ThemedLoading size="sm" variant="synapse" className={cn("inline-flex", className)} />
}
