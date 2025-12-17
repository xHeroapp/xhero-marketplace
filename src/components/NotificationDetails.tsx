"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useAuthStore } from "@/store/authStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { supabase } from "@/supabase-client";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const NotificationDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const notification = useNotificationsStore(
    (s) => s.notifications[id] || s.selectedNotification
  );

  const { user } = useAuthStore();

  useEffect(() => {
    if (!notification && id) {
      setLoading(true);
      setError(null);
      supabase
        .from("notifications")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            setError(error.message || "Failed to load notification");
            setLoading(false);
          } else if (data) {
            useNotificationsStore.getState().upsertNotification(data);
            setLoading(false);
          } else {
            setError("Notification not found");
            setLoading(false);
          }
        })
        .catch((err) => {
          setError("An unexpected error occurred");
          setLoading(false);
        });
    } else if (!id) {
      setError("No notification ID provided");
    }
  }, [id]);

  //   Read notification
  useEffect(() => {
    if (notification && id && !notification.is_read) {
      useNotificationsStore.getState().markAsRead(id);
      supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .then()
        .catch((error) => {
          console.error("Failed to mark as read:", error);
        });
    }
    queryClient.refetchQueries({
      queryKey: ["notifications-count", user && user.id],
      exact: true,
    });
  }, [notification?.id, id]);

  return (
    <>
      <HeaderTwo links="home" title="Notification Details" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="notification-area pt-3 pb-2">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading notification...</p>
              </div>
            )}

            {error && !loading && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="ti ti-alert-circle me-2"></i>
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            {!loading && !error && !notification && id && (
              <div className="text-center py-5">
                <i className="ti ti-bell-off display-1 text-muted"></i>
                <h5 className="mt-3">No Notification Found</h5>
                <p className="text-muted">
                  This notification may have been deleted.
                </p>
              </div>
            )}

            {!loading && !error && notification && (
              <div className="list-group-item d-flex py-3 bg-transparent">
                <span className="noti-icon">
                  <i className="ti ti-check"></i>
                </span>
                <div className="noti-info">
                  <h6>{notification.title}</h6>
                  <p>{notification.message}</p>
                  {notification.data?.link && (
                    <a className="btn btn-light" href={notification.data.link}>
                      View
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default NotificationDetails;
