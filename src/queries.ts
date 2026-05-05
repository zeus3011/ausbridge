import { client } from './sanityClient.ts';

/**
 * GROQ query and fetcher for the homepage payload.
 */

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  _id,
  _type,
  header {
    logo {
      asset -> {
        url
      }
    },
    navLinks[] {
      label,
      link
    },
    phone,
    ctaText,
    ctaLink,
    ctaOpenInModal
  },
  hero {
    slides[] {
      heading,
      subheading,
      backgroundImage {
        asset -> {
          url
        }
      },
      buttons[] {
        text,
        link,
        openInModal
      },
      button2[] {
        text,
        link,
        openInModal
      }
    },
    features[] {
      icon {
        asset -> {
          url
        }
      },
      title,
      subtitle
    }
  },
  trustStrip {
    trustItems[] {
      icon,
      title,
      subtitle
    }
  },
  howWeWork {
    tagline,
    heading,
    subheading,
    steps[] {
      icon {
        asset -> {
          url
        }
      },
      title,
      description
    },
    primaryCTA {
      text,
      link,
      openInModal
    },
    secondaryCTA {
      text,
      link,
      openInModal
    }
  },
  services[] {
    tagline,
    heading,
    subheading,
    steps[]{
      title,
      image {
        asset -> {
          url
        }
      },
      badge,
      link,
      items[] {
        text
      }
    },
    primaryCTA {
      text,
      link,
      openInModal
    },
    secondaryCTA {
      text,
      link,
      openInModal
    }
  },
  outcomes {
    tagline,
    heading,
    testimonials[] {
      quote,
      clientName,
      visaCategory
    }
  },
  about {
    title,
    description,
    image {
      asset -> {
        url
      }
    }
  },
  insights {
    tagline,
    heading,
    viewAllLink,
    articles[] {
      icon,
      tag,
      title,
      description,
      link
    }
  },
  cta {
    tagline,
    heading,
    description,
    buttonText,
    buttonLink,
    openInModal
  },
  footer {
    logo {
      asset -> {
        url
      }
    },
    tagline,
    description,
    contact {
      phone,
      email,
      address
    },
    quickLinks[] {
      label,
      link
    },
    compliance {
      marn,
      details[]
    },
    socialLinks[] {
      platform,
      url
    },
    copyright
  },
  consultationModal {
    tagline,
    heading,
    subheading,
    fullNameLabel,
    fullNamePlaceholder,
    emailLabel,
    emailPlaceholder,
    phoneLabel,
    phonePlaceholder,
    defaultPhonePrefix,
    interestLabel,
    interestPlaceholder,
    interestOptions[],
    consentPrefix,
    termsLabel,
    termsLink,
    privacyLabel,
    privacyLink,
    submitButtonText,
    submittingButtonText,
    successHeading,
    successMessage,
    successCloseText
  }
}`;

export async function fetchHomepage() {
  try {
    const data = await client.fetch(HOMEPAGE_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    throw error;
  }
}
