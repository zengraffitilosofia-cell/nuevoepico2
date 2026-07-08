import * as React from 'react';
import {
  motion,
  type HTMLMotionProps,
  type Transition,
  type UseInViewOptions,
  useInView,
} from 'motion/react';

type RollingTextProps = HTMLMotionProps<'span'> & {
  text: string;
  transition?: Transition;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  delay?: number;
};

function RollingText({
  text,
  transition = { duration: 0.5, delay: 0.1, ease: 'easeInOut' },
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  delay = 0,
  ...props
}: RollingTextProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  const charVariants = {
    hidden: { rotateX: 90 },
    visible: { rotateX: 0 },
  };

  return (
    <span data-slot="rolling-text" ref={localRef} {...props}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            perspective: '9999999px',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.span
            data-slot="rolling-text-char"
            style={{ display: 'inline-block', backfaceVisibility: 'hidden' }}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={charVariants}
            transition={{
              ...transition,
              delay: delay + index * (transition?.delay ?? 0.1),
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export { RollingText, type RollingTextProps };
