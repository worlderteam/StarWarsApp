package com.starwarsapp

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.util.Log

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)

        // Check if the app was launched from a notification
        val intent = intent
        if (intent?.extras != null) {
            handleNotificationIntent(intent)
        }
    }

    /**
     * Handles the intent passed when the app is opened from a notification.
     */
    private fun handleNotificationIntent(intent: Intent) {
        val notificationData = intent.extras

        if (notificationData != null) {
            // Retrieve the notification payload
            val message = notificationData.getString("message")
            val groupId = notificationData.getString("groupId")

            // Example logging
            Log.d("Notification", "Message: $message, Group ID: $groupId")

            // Handle opening the app with specific navigation to a screen based on notification
            if (message != null && groupId != null) {
                // Example: Pass notification data to JavaScript side for handling
                val launchIntent = Intent(this, MainActivity::class.java)
                launchIntent.putExtra("message", message)
                launchIntent.putExtra("groupId", groupId)
                startActivity(launchIntent)
            }
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "StarWarsApp"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}