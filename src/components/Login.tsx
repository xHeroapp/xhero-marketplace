"use client";
import { authSchema } from "@/schema/authSchema";
import Link from "next/link";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "@/queries/auth.queries";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const Login = () => {
  // if user gets redireted back to the login page on expired link
  const searchParams = useSearchParams();
  const InvalidOrExpiredMagicLinkError = searchParams.get("error");

  useEffect(() => {
    InvalidOrExpiredMagicLinkError &&
      toast.error("Your magic link has expired. Please request a new one");
  }, [InvalidOrExpiredMagicLinkError]);

  // Queries
  const LoginQuery = useLogin();
  //   form handler
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    try {
      const promise = LoginQuery.mutateAsync(data.email);
      toast.promise(promise, {
        loading: "Logging...",
        success: "Magic Link has been sent to your email",
        error: "There was an error while trying to login",
      });
      await promise;
      console.log(promise);
    } catch (err) {
      console.log(err);
    }

    console.log(data);
  }

  return (
    <>
      <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
        <div className="background-shape"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-lg-8">
              <img
                className="big-logo"
                src="img/core-img/logo-white.png"
                alt=""
              />

              <div className="register-form mt-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group text-start mb-4">
                    <span>Email</span>
                    <label htmlFor="email">
                      <i className="ti ti-user"></i>
                    </label>
                    <input
                      className="form-control"
                      id="username"
                      type="text"
                      placeholder="info@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-white">Invalid email</p>
                    )}
                  </div>
                  {/* <div className="form-group text-start mb-4">
                    <span>Password</span>
                    <label htmlFor="password">
                      <i className="ti ti-key"></i>
                    </label>
                    <input
                      className="form-control"
                      id="password"
                      type="password"
                      placeholder="Password"
                    />
                  </div> */}
                  {/* <Link href="/home"> */}
                  <button
                    disabled={LoginQuery.isPending}
                    className="btn btn-custom-alternate btn-lg w-100"
                    type="submit"
                  >
                    {LoginQuery.isPending ? "Logging in..." : "Log In"}
                  </button>
                  {/* </Link> */}
                </form>
              </div>

              {/* <div className="login-meta-data">
								<Link
									className="forgot-password d-block mt-3 mb-1"
									href="/forget-password"
								>
									Forgot Password?
								</Link>
								<p className="mb-0">
									Didnt have an account?
									<Link className="mx-1" href="/register">
										Register Now
									</Link>
								</p>
							</div> */}

              <div className="view-as-guest mt-3">
                <Link className="btn btn-primary btn-sm" href="/home">
                  View as guest<i className="ps-2 ti ti-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
