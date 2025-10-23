"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useAction } from "next-safe-action/hooks";
import { submitRsvp } from "./actions";
import { NumericFormat } from "react-number-format";
import { formSchema } from "./schema";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { ISourceOptions } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import { MouseParticles } from "@/components/mouse-particles";

export default function Page() {
  const [init, setInit] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const played = useRef<boolean>(false);

  useEffect(() => {
    function play() {
      if (played.current) return;
      played.current = true;

      if (audioRef.current == null) return;
      
      const mql = window.matchMedia(`(max-width: 639px)`);
      if (mql.matches) {
        audioRef.current.src = "/assets/bgm-mobile.mp3";
      } else {
        audioRef.current.src = "/assets/bgm-desktop.mp3";
      }

      audioRef.current.load();
      audioRef.current.play();
    }

    window.addEventListener("click", play);

    return () => {
      window.removeEventListener("click", play);
    };
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);

      // await loadFireworksPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      key: "fireworks",
      name: "Fireworks",
      fullScreen: {
        enable: true,
      },
      background: {
        color: "transparent",
      },
      emitters: {
        direction: "top",
        life: {
          count: 0,
          duration: 0.1,
          delay: 0.1,
        },
        rate: {
          delay: 0.15,
          quantity: 1,
        },
        size: {
          width: 100,
          height: 0,
        },
        position: {
          y: 100,
          x: 50,
        },
      },
      particles: {
        number: {
          value: 0,
        },
        destroy: {
          bounds: {
            top: 30,
          },
          mode: "split",
          split: {
            count: 1,
            factor: {
              value: 0.333333,
            },
            rate: {
              value: 100,
            },
            particles: {
              stroke: {
                width: 0,
              },
              color: {
                value: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"],
              },
              number: {
                value: 0,
              },
              collisions: {
                enable: false,
              },
              destroy: {
                bounds: {
                  top: 0,
                },
              },
              opacity: {
                value: {
                  min: 0.1,
                  max: 1,
                },
                animation: {
                  enable: true,
                  speed: 0.7,
                  sync: false,
                  startValue: "max",
                  destroy: "min",
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: 2,
                animation: {
                  enable: false,
                },
              },
              life: {
                count: 1,
                duration: {
                  value: {
                    min: 1,
                    max: 2,
                  },
                },
              },
              move: {
                enable: true,
                gravity: {
                  enable: true,
                  acceleration: 9.81,
                  inverse: false,
                },
                decay: 0.1,
                speed: {
                  min: 10,
                  max: 25,
                },
                direction: "outside",
                outModes: "destroy",
              },
            },
          },
        },
        life: {
          count: 1,
        },
        shape: {
          type: "line",
        },
        size: {
          value: {
            min: 0.1,
            max: 50,
          },
          animation: {
            enable: true,
            sync: true,
            speed: 20,
            startValue: "max",
            destroy: "min",
          },
        },
        stroke: {
          color: {
            value: "#ffffff",
          },
          width: 1,
        },
        rotate: {
          enable: true,
          path: true,
        },
        move: {
          enable: true,
          gravity: {
            acceleration: 9.81,
            enable: true,
            inverse: true,
            maxSpeed: 100,
          },
          speed: {
            min: 1,
            max: 7,
          },
          outModes: {
            default: "destroy",
            top: "none",
          },
          trail: {
            fill: { color: "transparent" },
            enable: true,
            length: 10,
          },
        },
      },
    }),
    []
  );

  const submitAction = useAction(submitRsvp);
  const form = useForm({
    defaultValues: {
      name: "",
      guest_count: NaN,
      phone: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const result = await submitAction.executeAsync(value);
      console.log(result);
    },
  });

  if (!init) return null;

  return (
    <>
      <audio ref={audioRef} autoPlay loop>
        Your browser does not support the audio element.
      </audio>

      <MouseParticles g={6} color={"#ffd700"} />

      <Particles
        id="tsparticles"
        particlesLoaded={(container): Promise<void> => {
          console.log(container);
          return Promise.resolve();
        }}
        options={options}
      />

      <div className="flex flex-col justify-center items-center h-full pt-56 sm:pt-0 relative z-10">
        <Image
          src="/assets/logo.svg"
          alt="Logo"
          width={147}
          height={117}
          className="sm:block hidden"
        />

        <Image
          src="/assets/title-desktop.svg"
          alt="Title"
          width={404}
          height={195}
          className="sm:block hidden -mt-2"
        />

        <Image
          src="/assets/title-mobile.svg"
          alt="Title"
          width={200}
          height={100}
          className="sm:hidden block"
        />

        <form
          id="rsvp-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-[340px] sm:w-[800px]"
        >
          <FieldSet>
            <FieldGroup className="items-center">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="relative w-[271px] sm:w-full"
                    >
                      <Image
                        src="/assets/input.svg"
                        width={800}
                        height={112}
                        alt="Input Background"
                        className="object-cover hidden sm:block"
                      />

                      <Image
                        src="/assets/input-mobile.svg"
                        width={261}
                        height={60}
                        alt="Input Background"
                        className="object-cover block sm:hidden"
                      />
                      <div className="absolute grid grid-cols-2 gap-2 px-8 py-4 sm:px-12 sm:py-5">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-white flex-col gap-0!"
                        >
                          <p className="text-label leading-4 sm:leading-7">
                            <span className="font-gilda-display text-[10pt] sm:text-[24px] font-semibold">
                              NAME
                            </span>
                            <br />
                            <span className="font-san-ji text-[10pt] sm:text-[24px] font-semibold">
                              来宾姓名
                            </span>
                          </p>
                        </FieldLabel>

                        <div className="self-center">
                          <Input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                            placeholder="Please enter..."
                            className=" placeholder:text-label/50 placeholder:text-[9pt] text-[9pt]! sm:placeholder:text-[20px] sm:text-[20px]! text-label! font-gilda-display border-transparent shadow-none"
                          />

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </div>
                      </div>
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="guest_count">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="relative w-[271px] sm:w-full"
                    >
                      <Image
                        src="/assets/input.svg"
                        width={800}
                        height={112}
                        alt="Input Background"
                        className="object-cover hidden sm:block"
                      />

                      <Image
                        src="/assets/input-mobile.svg"
                        width={261}
                        height={60}
                        alt="Input Background"
                        className="object-cover block sm:hidden"
                      />
                      <div className="absolute grid grid-cols-2 gap-2 px-8 py-4 sm:px-12 sm:py-5">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-white flex-col gap-0!"
                        >
                          <p className="text-label leading-4 sm:leading-7">
                            <span className="font-gilda-display text-[10pt] sm:text-[24px] font-semibold">
                              NO. OF GUEST
                            </span>
                            <br />
                            <span className="font-san-ji text-[10pt] sm:text-[24px] font-semibold">
                              来宾人数
                            </span>
                          </p>
                        </FieldLabel>

                        <div className="self-center">
                          <NumericFormat
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onValueChange={(v) =>
                              field.handleChange(v.floatValue || 0)
                            }
                            aria-invalid={isInvalid}
                            autoComplete="off"
                            placeholder="Please enter..."
                            customInput={Input}
                            className=" placeholder:text-label/50 placeholder:text-[9pt] text-[9pt]! sm:placeholder:text-[20px] sm:text-[20px]! text-label! font-gilda-display border-transparent shadow-none"
                          />

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </div>
                      </div>
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="relative w-[271px] sm:w-full"
                    >
                      <Image
                        src="/assets/input.svg"
                        width={800}
                        height={112}
                        alt="Input Background"
                        className="object-cover hidden sm:block"
                      />

                      <Image
                        src="/assets/input-mobile.svg"
                        width={261}
                        height={60}
                        alt="Input Background"
                        className="object-cover block sm:hidden"
                      />
                      <div className="absolute grid grid-cols-2 gap-2 px-8 py-4 sm:px-12 sm:py-5">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-white flex-col gap-0!"
                        >
                          <p className="text-label leading-4 sm:leading-7">
                            <span className="font-gilda-display text-[10pt] sm:text-[24px] font-semibold">
                              CONTACT NO.
                            </span>
                            <br />
                            <span className="font-san-ji text-[10pt] sm:text-[24px] font-semibold">
                              手机号码
                            </span>
                          </p>
                        </FieldLabel>

                        <div className="self-center">
                          <Input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                            placeholder="Please enter..."
                            className=" placeholder:text-label/50 placeholder:text-[9pt] text-[9pt]! sm:placeholder:text-[20px] sm:text-[20px]! text-label! font-gilda-display border-transparent shadow-none"
                          />

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </div>
                      </div>
                    </Field>
                  );
                }}
              </form.Field>

              <Field>
                <Button
                  type="submit"
                  form="rsvp-form"
                  className="flex gap-2 pt-2 w-[100px] h-[14px] sm:w-[140px] pl-1 sm:pl-0.5"
                >
                  <p className="font-gilda-display text-[14px] sm:text-[22px] leading-0">
                    Submit
                  </p>

                  <p className="font-san-ji text-[12px] sm:text-[16px] leading-0">
                    点击提交
                  </p>
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>

        <Image
          src="/assets/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="sm:hidden block"
        />
      </div>
    </>
  );
}
