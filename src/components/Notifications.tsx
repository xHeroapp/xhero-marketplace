"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetNotifications } from "@/queries/notifications.queries";
import { useAuthStore } from "@/store/authStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { supabase } from "@/supabase-client";
import { formatDate } from "@/utils/formatDate";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Notifications = () => {
  const { user } = useAuthStore();
  const { setNotifications, selectNotification } = useNotificationsStore();

  const queryClient = useQueryClient();

  //   router
  const router = useRouter();

  const notificationQuery = useGetNotifications(user);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "pubic",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate both queries so UI updates immediately
          queryClient.invalidateQueries(["notifications", user?.id]);
          queryClient.refetchQueries({
            queryKey: ["notifications-count", user?.id],
            exact: true,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (notificationQuery.isSuccess) {
      setNotifications(notificationQuery.data);
    }
  }, [notificationQuery.isSuccess]);

  const onOpenNotification = (id: string) => {
    selectNotification(id);
    router.push(`/notification-details?id=${id}`);
  };

  return (
    <>
      <HeaderTwo links="home" title="Notifications" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="section-heading d-flex align-items-center pt-3 justify-content-between rtl-flex-d-row-r">
            <h6>Notification(s)</h6>
            {/* <a className="notification-clear-all text-secondary" href="#">
              Clear All
            </a> */}
          </div>

          <div className="notification-area pb-2">
            {notificationQuery.isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading notifications...</p>
              </div>
            )}

            {notificationQuery.isError && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="ti ti-alert-circle me-2"></i>
                <div>
                  <strong>Error:</strong> Failed to load notifications. Please
                  try again.
                </div>
              </div>
            )}

            {notificationQuery.isSuccess &&
              notificationQuery.data?.length === 0 && (
                <div className="text-center py-5">
                  <i className="ti ti-bell-off display-1 text-muted"></i>
                  <h5 className="mt-3">No Notifications</h5>
                  <p className="text-muted">
                    You don't have any notifications yet.
                  </p>
                </div>
              )}

            {notificationQuery.isSuccess &&
              notificationQuery.data?.length > 0 && (
                <div className="list-group">
                  {notificationQuery.data.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => onOpenNotification(notification.id)}
                      className={`list-group-item ${
                        notification.is_read && "readed"
                      } d-flex align-items-center border-0`}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="noti-icon">
                        <i className="ti ti-bell-ringing"></i>
                      </span>
                      <div className="noti-info">
                        <h6 className="mb-1">{notification.title}</h6>
                        <span>{formatDate(notification.created_at)}</span>
                      </div>
                    </div>
                  ))}
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

export default Notifications;
