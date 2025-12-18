"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  EditProfileFormData,
  editProfileSchema,
} from "@/schema/editProfileSchema";
import { UpdateProfile } from "@/queries/auth.queries";
import ImageWithFallback from "./reuseable/ImageWithFallback";

const EditProfile = () => {
  const { user, setUser } = useAuthStore();

  const UpdateProfileQuery = UpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      delivery_address: "",
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      reset({
        full_name: user?.full_name || "Suha Jannat",
        phone: user?.phone || "+880 000 111 222",
        email: user?.email || "care@example.com",
        delivery_address: user?.delivery_address || "",
      });
    }
  }, [user, reset]);

  // Form submission handler
  const onSubmit = async (data: EditProfileFormData) => {
    const user_data = { ...data, user_id: user.id };
    try {
      const promise = UpdateProfileQuery.mutateAsync(user_data);

      toast.promise(promise, {
        loading: "Updating...",
        success: (userData) => {
          console.log("Form data to submit:", data);
          console.log(userData);
          setUser(userData[0]);
          return "Updated!";
        },
        error:
          "There was an error while trying to update your profile, please try again later.",
      });

      // setUser(UserData)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HeaderTwo links="profile" title="Edit Profile" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="profile-wrapper-area py-3">
            <div className="card user-info-card">
              <div className="card-body p-4 d-flex align-items-center">
                <div className="user-profile me-3">
                  <ImageWithFallback
                    src={
                      user && user?.avatar_url
                        ? user?.avatar_url
                        : `/assets/img/core-img/user-profile-male.jpg`
                    }
                    alt={user && user.full_name}
                  />
                  <div className="change-user-thumb">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input className="form-control-file" type="file" />
                      <button type="button">
                        <i className="ti ti-pencil"></i>
                      </button>
                    </form>
                  </div>
                </div>
                <div className="user-info">
                  <h5 className="mb-0 text-white">
                    {(user && user?.full_name) || "Suha Jannat"}
                  </h5>
                  <p className="mb-0 text-white">
                    @{(user && user?.email) || "designing-world"}
                  </p>
                </div>
              </div>
            </div>

            <div className="card user-data-card">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <div className="title mb-2">
                      <i className="ti ti-user"></i>
                      <span>Full Name</span>
                    </div>
                    <input
                      className={`form-control ${
                        errors.full_name ? "is-invalid" : ""
                      }`}
                      type="text"
                      {...register("full_name")}
                    />
                    {errors.full_name && (
                      <div className="invalid-feedback">
                        {errors.full_name.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="title mb-2">
                      <i className="ti ti-phone"></i>
                      <span>Phone</span>
                    </div>
                    <input
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      type="text"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="title mb-2">
                      <i className="ti ti-mail"></i>
                      <span>Email Address</span>
                    </div>
                    <input
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      type="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="title mb-2">
                      <i className="ti ti-location"></i>
                      <span>Shipping Address</span>
                    </div>
                    <input
                      className={`form-control ${
                        errors.delivery_address ? "is-invalid" : ""
                      }`}
                      type="text"
                      {...register("delivery_address")}
                    />
                    {errors.delivery_address && (
                      <div className="invalid-feedback">
                        {errors.delivery_address.message}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Save All Changes"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default EditProfile;
