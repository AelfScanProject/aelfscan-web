'use client';
import IconFont from '@_components/IconFont';
import animateScrollTo from 'animated-scroll-to';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import './index.css';
import { useThrottleFn } from 'ahooks';
const BACK_TO_TOP_HEIGHT = 40;
interface IProps {
  isDark: boolean;
}
const BackToTopButton = ({ isDark }: IProps) => {
  const [showButton, setShowButton] = useState(false);

  const { run: checkScrollHeight } = useThrottleFn(
    () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > BACK_TO_TOP_HEIGHT) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );
  useEffect(() => {
    window.addEventListener('scroll', checkScrollHeight);
    return () => {
      window.removeEventListener('scroll', checkScrollHeight);
    };
  }, [checkScrollHeight]);

  const scrollToTop = () => {
    try {
      animateScrollTo(0, { speed: 100, elementToScroll: document.documentElement });
    } catch (e) {
      console.error('Error scrolling to top:', e);
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <div onClick={scrollToTop} className={clsx('back-to-top-container')}>
      <IconFont type="arrow-up-to-line" />
      <span className="text">Back to Top</span>
    </div>
  );
};

export default BackToTopButton;
